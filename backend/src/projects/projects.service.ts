import { Injectable } from '@nestjs/common';
import {
  Prisma,
  ProductionStage,
  ProjectStatus,
  QuotationStatus,
} from '@prisma/client';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { generateProjectCode } from '../common/utils/project-code';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  list(status?: ProjectStatus, search?: string) {
    return this.prisma.project.findMany({
      where: {
        status,
        ...(search
          ? {
              OR: [
                { code: { contains: search, mode: 'insensitive' } },
                { title: { contains: search, mode: 'insensitive' } },
                { customer: { name: { contains: search, mode: 'insensitive' } } },
                { furnitureType: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  getById(id: string) {
    return this.prisma.project.findUniqueOrThrow({
      where: { id },
      include: {
        customer: true,
        lead: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        statusHistory: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        measurements: {
          where: {
            isCurrent: true,
          },
          orderBy: {
            version: 'desc',
          },
          take: 1,
          include: {
            rooms: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
        quotations: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            items: true,
          },
        },
        payments: {
          orderBy: [
            { paymentDate: 'desc' },
            { createdAt: 'desc' },
          ],
        },
        design: {
          select: {
            id: true,
            isPublished: true,
            updatedAt: true,
            publishedAt: true,
          },
        },
        productionJob: true,
      },
    });
  }

  async getTrackerByCode(code: string) {
    const project = await this.prisma.project.findUniqueOrThrow({
      where: { code },
      include: {
        customer: true,
        design: {
          select: {
            id: true,
            isPublished: true,
          },
        },
        statusHistory: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        quotations: {
          orderBy: [
            { createdAt: 'desc' },
          ],
          select: {
            id: true,
            code: true,
            status: true,
            grandTotal: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        payments: {
          orderBy: [
            { paymentDate: 'desc' },
            { createdAt: 'desc' },
          ],
          select: {
            id: true,
            amount: true,
            paymentDate: true,
            type: true,
            mode: true,
          },
        },
        productionJob: {
          select: {
            currentStage: true,
            completedStages: true,
            updatedAt: true,
          },
        },
        measurements: {
          where: {
            isCurrent: true,
          },
          select: {
            id: true,
            version: true,
            updatedAt: true,
          },
        },
      },
    });

    const trackerStatus = this.mapProjectStatusToTrackerStage(project.status);
    const trackerStages = [
      'Inquiry',
      'Site Visit',
      'Design',
      'Manufacturing',
      'Installation',
      'Completed',
    ];
    const currentStageIndex = trackerStages.indexOf(trackerStatus);
    const progressPercent =
      currentStageIndex >= 0
        ? Math.round(((currentStageIndex + 1) / trackerStages.length) * 100)
        : 0;
    const latestQuotation = project.quotations[0] ?? null;
    const latestApprovedQuotation = project.quotations.find(
      (quotation) => quotation.status === QuotationStatus.APPROVED,
    );
    const approvedAmount = Number(latestApprovedQuotation?.grandTotal ?? 0);
    const collectedAmount = project.payments.reduce(
      (sum, payment) => sum + Number(payment.amount ?? 0),
      0,
    );
    const outstandingAmount = Math.max(approvedAmount - collectedAmount, 0);
    const latestPayment = project.payments[0] ?? null;
    const timelineStages = trackerStages.map((stage, index) => ({
      label: stage,
      status:
        index < currentStageIndex
          ? 'done'
          : index === currentStageIndex
            ? 'current'
            : 'pending',
      date:
        project.statusHistory.find(
          (entry) => this.mapProjectStatusToTrackerStage(entry.status) === stage,
        )?.createdAt.toISOString() ?? null,
      note:
        project.statusHistory.find(
          (entry) => this.mapProjectStatusToTrackerStage(entry.status) === stage,
        )?.note ?? null,
    }));

    return {
      code: project.code,
      title: project.title,
      customerName: project.customer.name,
      location: project.location ?? project.customer.location ?? 'N/A',
      furnitureType: project.furnitureType ?? 'Custom Furniture',
      currentStatus: trackerStatus,
      progressPercent,
      lastUpdated:
        project.statusHistory[project.statusHistory.length - 1]?.createdAt.toISOString() ??
        project.updatedAt.toISOString(),
      expectedCompletionDate:
        project.expectedCompletionDate?.toISOString() ?? null,
      statusNote:
        project.statusHistory[project.statusHistory.length - 1]?.note ?? null,
      has3DDesign: Boolean(project.design?.id && project.design.isPublished),
      measurementVersion: project.measurements[0]?.version ?? null,
      design: {
        hasDesign: Boolean(project.design?.id),
        isPublished: Boolean(project.design?.id && project.design.isPublished),
      },
      quotation: {
        code: latestQuotation?.code ?? null,
        status: latestQuotation?.status ?? null,
        approvedAmount,
      },
      finance: {
        collectedAmount,
        outstandingAmount,
        lastPaymentDate: latestPayment?.paymentDate.toISOString() ?? null,
      },
      production: {
        currentStage: project.productionJob?.currentStage ?? null,
        completedStages: Array.isArray(project.productionJob?.completedStages)
          ? (project.productionJob?.completedStages as ProductionStage[])
          : [],
        updatedAt: project.productionJob?.updatedAt.toISOString() ?? null,
      },
      timeline: timelineStages,
    };
  }

  async create(dto: CreateProjectDto, user?: AuthenticatedUser) {
    await this.prisma.customer.findUniqueOrThrow({
      where: { id: dto.customerId },
      select: { id: true },
    });

    if (dto.assignedToId) {
      await this.prisma.user.findUniqueOrThrow({
        where: { id: dto.assignedToId },
        select: { id: true },
      });
    }

    if (dto.leadId) {
      await this.prisma.lead.findUniqueOrThrow({
        where: { id: dto.leadId },
        select: { id: true },
      });
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const code = await generateProjectCode(this.prisma);

        return await this.prisma.$transaction(async (tx) => {
          const project = await tx.project.create({
            data: {
              code,
              title: dto.title,
              scope: dto.scope,
              furnitureType: dto.furnitureType,
              location: dto.location,
              addressLine1: dto.addressLine1,
              city: dto.city,
              status: dto.status ?? ProjectStatus.INQUIRY,
              priority: dto.priority,
              customerId: dto.customerId,
              leadId: dto.leadId,
              assignedToId: dto.assignedToId,
              createdById: user?.sub,
              estimatedValue: dto.estimatedValue,
              startDate: dto.startDate ? new Date(dto.startDate) : undefined,
              expectedCompletionDate: dto.expectedCompletionDate
                ? new Date(dto.expectedCompletionDate)
                : undefined,
              notes: dto.notes,
            },
          });

          await tx.projectStatusHistory.create({
            data: {
              projectId: project.id,
              status: project.status,
              note: 'Project created',
              changedById: user?.sub,
            },
          });

          if (dto.leadId) {
            await tx.lead.update({
              where: { id: dto.leadId },
              data: {
                status: 'CONVERTED',
                convertedAt: new Date(),
              },
            });
          }

          return project;
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002' &&
          attempt < 2
        ) {
          continue;
        }

        throw error;
      }
    }

    throw new Error('Unable to generate a unique project code');
  }

  async update(id: string, dto: UpdateProjectDto, user: AuthenticatedUser) {
    const existing = await this.prisma.project.findUniqueOrThrow({
      where: { id },
    });

    if (dto.assignedToId) {
      await this.prisma.user.findUniqueOrThrow({
        where: { id: dto.assignedToId },
        select: { id: true },
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.update({
        where: { id },
        data: {
          title: dto.title,
          scope: dto.scope,
          furnitureType: dto.furnitureType,
          location: dto.location,
          addressLine1: dto.addressLine1,
          city: dto.city,
          status: dto.status,
          priority: dto.priority,
          assignedToId: dto.assignedToId,
          estimatedValue: dto.estimatedValue,
          startDate: dto.startDate ? new Date(dto.startDate) : undefined,
          expectedCompletionDate: dto.expectedCompletionDate
            ? new Date(dto.expectedCompletionDate)
            : undefined,
          notes: dto.notes,
        },
      });

      if (dto.status && dto.status !== existing.status) {
        await tx.projectStatusHistory.create({
          data: {
            projectId: id,
            status: dto.status,
            note: dto.statusNote,
            changedById: user.sub,
          },
        });
      }

      return project;
    });
  }

  private mapProjectStatusToTrackerStage(status: ProjectStatus) {
    switch (status) {
      case ProjectStatus.INQUIRY:
        return 'Inquiry';
      case ProjectStatus.SITE_VISIT:
      case ProjectStatus.MEASUREMENT:
        return 'Site Visit';
      case ProjectStatus.DESIGN:
      case ProjectStatus.QUOTATION_SENT:
        return 'Design';
      case ProjectStatus.ORDER_CONFIRMED:
      case ProjectStatus.PRODUCTION:
        return 'Manufacturing';
      case ProjectStatus.INSTALLATION:
        return 'Installation';
      default:
        return 'Completed';
    }
  }
}
