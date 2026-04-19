import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  ProjectStatus,
  QuotationStatus,
} from '@prisma/client';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { UpdateQuotationStatusDto } from './dto/update-quotation-status.dto';

@Injectable()
export class QuotationsService {
  constructor(private readonly prisma: PrismaService) {}

  list(status?: QuotationStatus, projectId?: string) {
    return this.prisma.quotation.findMany({
      where: {
        status,
        projectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        project: {
          include: {
            customer: true,
          },
        },
        items: true,
      },
    });
  }

  getById(id: string) {
    return this.prisma.quotation.findUniqueOrThrow({
      where: { id },
      include: {
        project: {
          include: {
            customer: true,
          },
        },
        items: true,
      },
    });
  }

  async create(dto: CreateQuotationDto, user: AuthenticatedUser) {
    await this.ensureProjectExists(dto.projectId);

    if (dto.items.length === 0) {
      throw new BadRequestException('At least one quotation line item is required');
    }

    const totals = this.calculateTotals(dto.items, dto.gstRate);

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const code = await this.generateQuotationCode();

        const quotation = await this.prisma.quotation.create({
          data: {
            code,
            projectId: dto.projectId,
            status: dto.status ?? QuotationStatus.DRAFT,
            subtotal: totals.subtotal,
            gstRate: totals.gstRate,
            gstAmount: totals.gstAmount,
            grandTotal: totals.grandTotal,
            notes: dto.notes,
            validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
            items: {
              create: dto.items.map((item) => ({
                name: item.name,
                category: item.category,
                qty: item.qty,
                unit: item.unit,
                rate: item.rate,
                lineTotal: item.qty * item.rate,
              })),
            },
          },
          include: {
            project: {
              include: {
                customer: true,
              },
            },
            items: true,
          },
        });

        if (quotation.status !== QuotationStatus.DRAFT) {
          await this.syncProjectWorkflow(
            quotation.projectId,
            quotation.status,
            user,
            'Quotation created with status sync',
          );
        }

        return quotation;
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

    throw new BadRequestException('Unable to generate a unique quotation code');
  }

  async update(id: string, dto: UpdateQuotationDto) {
    const existing = await this.prisma.quotation.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Quotation not found');
    }

    if (existing.status !== QuotationStatus.DRAFT) {
      throw new BadRequestException(
        'Only draft quotations can be edited directly',
      );
    }

    const nextItems =
      dto.items?.map((item) => ({
        name: item.name?.trim() ?? '',
        category: item.category?.trim() ?? '',
        qty: item.qty ?? 0,
        unit: item.unit?.trim() ?? '',
        rate: item.rate ?? 0,
      })) ??
      existing.items.map((item) => ({
        name: item.name,
        category: item.category,
        qty: Number(item.qty),
        unit: item.unit,
        rate: Number(item.rate),
      }));

    if (nextItems.length === 0) {
      throw new BadRequestException('Quotation must contain at least one line item');
    }

    const invalidItem = nextItems.find(
      (item) =>
        !item.name.trim() ||
        !item.category.trim() ||
        !item.unit.trim() ||
        item.qty <= 0 ||
        item.rate < 0,
    );

    if (invalidItem) {
      throw new BadRequestException('All quotation line items must be valid');
    }

    const totals = this.calculateTotals(nextItems, dto.gstRate ?? Number(existing.gstRate));

    return this.prisma.$transaction(async (tx) => {
      const quotation = await tx.quotation.update({
        where: { id },
        data: {
          status: dto.status ?? existing.status,
          notes: dto.notes ?? existing.notes,
          validUntil:
            dto.validUntil !== undefined
              ? new Date(dto.validUntil)
              : existing.validUntil,
          subtotal: totals.subtotal,
          gstRate: totals.gstRate,
          gstAmount: totals.gstAmount,
          grandTotal: totals.grandTotal,
        },
      });

      if (dto.items) {
        await tx.quotationItem.deleteMany({
          where: { quotationId: id },
        });

        await tx.quotationItem.createMany({
          data: nextItems.map((item) => ({
            quotationId: id,
            name: item.name,
            category: item.category,
            qty: item.qty,
            unit: item.unit,
            rate: item.rate,
            lineTotal: item.qty * item.rate,
          })),
        });
      }

      return tx.quotation.findUniqueOrThrow({
        where: { id: quotation.id },
        include: {
          project: {
            include: {
              customer: true,
            },
          },
          items: true,
        },
      });
    });
  }

  async updateStatus(
    id: string,
    dto: UpdateQuotationStatusDto,
    user: AuthenticatedUser,
  ) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id },
    });

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    this.assertValidStatusTransition(quotation.status, dto.status);

    return this.prisma.$transaction(async (tx) => {
      await tx.quotation.update({
        where: { id },
        data: {
          status: dto.status,
        },
      });

      await this.syncProjectWorkflow(
        quotation.projectId,
        dto.status,
        user,
        dto.note,
        tx,
      );

      return tx.quotation.findUniqueOrThrow({
        where: { id },
        include: {
          project: {
            include: {
              customer: true,
            },
          },
          items: true,
        },
      });
    });
  }

  private async ensureProjectExists(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (
      project.status === ProjectStatus.CANCELLED ||
      project.status === ProjectStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Quotations cannot be created for completed or cancelled projects',
      );
    }
  }

  private async generateQuotationCode() {
    const year = new Date().getFullYear();
    const yearStart = new Date(`${year}-01-01T00:00:00.000Z`);
    const yearEnd = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    const count = await this.prisma.quotation.count({
      where: {
        createdAt: {
          gte: yearStart,
          lt: yearEnd,
        },
      },
    });

    return `QUO-SVK-${String(year).slice(2)}-${String(count + 1).padStart(3, '0')}`;
  }

  private calculateTotals(
    items: Array<{ qty: number; rate: number }>,
    gstRateInput?: number,
  ) {
    const subtotal = items.reduce((acc, item) => acc + item.qty * item.rate, 0);
    const gstRate = gstRateInput ?? 18;
    const gstAmount = subtotal * (gstRate / 100);
    const grandTotal = subtotal + gstAmount;

    return {
      subtotal,
      gstRate,
      gstAmount,
      grandTotal,
    };
  }

  private assertValidStatusTransition(
    currentStatus: QuotationStatus,
    nextStatus: QuotationStatus,
  ) {
    const allowedTransitions: Record<QuotationStatus, QuotationStatus[]> = {
      DRAFT: [QuotationStatus.SENT, QuotationStatus.REJECTED],
      SENT: [QuotationStatus.APPROVED, QuotationStatus.REJECTED],
      APPROVED: [],
      REJECTED: [],
    };

    if (currentStatus === nextStatus) {
      return;
    }

    if (!allowedTransitions[currentStatus].includes(nextStatus)) {
      throw new BadRequestException(
        `Invalid quotation status transition from ${currentStatus} to ${nextStatus}`,
      );
    }
  }

  private async syncProjectWorkflow(
    projectId: string,
    quotationStatus: QuotationStatus,
    user: AuthenticatedUser,
    note?: string,
    tx: Prisma.TransactionClient = this.prisma,
  ) {
    if (quotationStatus === QuotationStatus.SENT) {
      await tx.project.update({
        where: { id: projectId },
        data: { status: ProjectStatus.QUOTATION_SENT },
      });

      await tx.projectStatusHistory.create({
        data: {
          projectId,
          status: ProjectStatus.QUOTATION_SENT,
          note,
          changedById: user.sub,
        },
      });
    }

    if (quotationStatus === QuotationStatus.APPROVED) {
      await tx.project.update({
        where: { id: projectId },
        data: { status: ProjectStatus.ORDER_CONFIRMED },
      });

      await tx.projectStatusHistory.create({
        data: {
          projectId,
          status: ProjectStatus.ORDER_CONFIRMED,
          note,
          changedById: user.sub,
        },
      });
    }
  }
}
