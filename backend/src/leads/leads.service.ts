import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LeadStatus, ProjectPriority, ProjectStatus } from '@prisma/client';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { generateProjectCode } from '../common/utils/project-code';
import { PrismaService } from '../prisma/prisma.service';
import { ConvertLeadDto } from './dto/convert-lead.dto';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  list(status?: LeadStatus, search?: string) {
    return this.prisma.lead.findMany({
      where: {
        status,
        ...(search
          ? {
              OR: [
                { fullName: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } },
                { interest: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: true,
        project: true,
      },
    });
  }

  async create(dto: CreateLeadDto) {
    const existingLead = await this.prisma.lead.findFirst({
      where: {
        phone: dto.phone,
        status: {
          notIn: [LeadStatus.CONVERTED, LeadStatus.LOST],
        },
      },
      select: {
        id: true,
      },
    });

    if (existingLead) {
      throw new ConflictException(
        'An active lead with this phone number already exists',
      );
    }

    return this.prisma.lead.create({
      data: {
        ...dto,
        email: dto.email?.toLowerCase(),
        followUpAt: dto.followUpAt ? new Date(dto.followUpAt) : undefined,
      },
      include: {
        customer: true,
        project: true,
      },
    });
  }

  update(id: string, dto: UpdateLeadDto) {
    const normalizedStatus = dto.status;
    const statusesThatSetContactedAt: LeadStatus[] = [
      LeadStatus.CONTACTED,
      LeadStatus.SITE_VISIT_SCHEDULED,
      LeadStatus.QUALIFIED,
      LeadStatus.CONVERTED,
    ];
    const contactedAt =
      dto.contactedAt
        ? new Date(dto.contactedAt)
        : normalizedStatus &&
            statusesThatSetContactedAt.includes(normalizedStatus)
          ? new Date()
          : undefined;

    return this.prisma.lead.update({
      where: { id },
      data: {
        ...dto,
        fullName: dto.fullName?.trim(),
        phone: dto.phone?.trim(),
        email: dto.email?.toLowerCase(),
        interest: dto.interest?.trim(),
        location: dto.location?.trim(),
        notes: dto.notes?.trim(),
        followUpAt: dto.followUpAt ? new Date(dto.followUpAt) : undefined,
        contactedAt,
      },
      include: {
        customer: true,
        project: true,
      },
    });
  }

  async convert(id: string, dto: ConvertLeadDto, user: AuthenticatedUser) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        customer: true,
        project: true,
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.project) {
      throw new BadRequestException('Lead has already been converted to a project');
    }

    const code = await generateProjectCode(this.prisma);

    if (dto.assignedToId) {
      await this.prisma.user.findUniqueOrThrow({
        where: { id: dto.assignedToId },
        select: { id: true },
      });
    }

    return this.prisma.$transaction(async (tx) => {
      let customerId = lead.customerId;

      if (!customerId) {
        const customer = await tx.customer.create({
          data: {
            name: lead.fullName,
            phone: lead.phone,
            email: lead.email,
            location: dto.location ?? lead.location,
            addressLine1: dto.addressLine1,
            city: dto.city,
            notes: dto.notes ?? lead.notes ?? undefined,
          },
        });

        customerId = customer.id;
      }

      const project = await tx.project.create({
        data: {
          code,
          title: dto.projectTitle,
          scope: dto.scope,
          furnitureType: dto.furnitureType ?? lead.interest ?? undefined,
          location: dto.location ?? lead.location ?? undefined,
          addressLine1: dto.addressLine1,
          city: dto.city,
          status: ProjectStatus.INQUIRY,
          priority: ProjectPriority.MEDIUM,
          customerId,
          leadId: lead.id,
          assignedToId: dto.assignedToId,
          createdById: user.sub,
          estimatedValue: dto.estimatedValue,
          notes: dto.notes,
        },
      });

      await tx.projectStatusHistory.create({
        data: {
          projectId: project.id,
          status: ProjectStatus.INQUIRY,
          note: 'Created from lead conversion',
          changedById: user.sub,
        },
      });

      await tx.lead.update({
        where: { id: lead.id },
        data: {
          status: LeadStatus.CONVERTED,
          convertedAt: new Date(),
          customerId,
        },
      });

      return tx.project.findUniqueOrThrow({
        where: { id: project.id },
        include: {
          customer: true,
          lead: true,
        },
      });
    });
  }
}
