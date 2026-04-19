import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentMode, PaymentType, QuotationStatus } from '@prisma/client';
import type { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

type PaymentFilters = {
  mode?: PaymentMode;
  type?: PaymentType;
  projectCode?: string;
};

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const startOfMonth = new Date();
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const [
      monthCollections,
      allCollections,
      averageQuotationValue,
      paymentCount,
      paymentsByMode,
      paymentsByType,
      approvedQuotations,
      projectPayments,
    ] = await Promise.all([
      this.prisma.payment.aggregate({
        where: {
          paymentDate: {
            gte: startOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),
      this.prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
      }),
      this.prisma.quotation.aggregate({
        _avg: {
          grandTotal: true,
        },
      }),
      this.prisma.payment.count(),
      this.prisma.payment.groupBy({
        by: ['mode'],
        _sum: {
          amount: true,
        },
      }),
      this.prisma.payment.groupBy({
        by: ['type'],
        _sum: {
          amount: true,
        },
      }),
      this.prisma.quotation.findMany({
        where: {
          status: QuotationStatus.APPROVED,
        },
        select: {
          projectId: true,
          grandTotal: true,
          updatedAt: true,
          createdAt: true,
        },
        orderBy: [
          { projectId: 'asc' },
          { updatedAt: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      this.prisma.payment.findMany({
        where: {
          projectId: {
            not: null,
          },
        },
        select: {
          projectId: true,
          amount: true,
        },
      }),
    ]);

    const collectedMonth = Number(monthCollections._sum.amount ?? 0);
    const collectedAllTime = Number(allCollections._sum.amount ?? 0);
    const latestApprovedByProject = new Map<string, number>();

    approvedQuotations.forEach((quotation) => {
      if (!latestApprovedByProject.has(quotation.projectId)) {
        latestApprovedByProject.set(
          quotation.projectId,
          Number(quotation.grandTotal ?? 0),
        );
      }
    });

    const paidByProject = new Map<string, number>();

    projectPayments.forEach((payment) => {
      if (!payment.projectId) {
        return;
      }

      paidByProject.set(
        payment.projectId,
        (paidByProject.get(payment.projectId) ?? 0) + Number(payment.amount ?? 0),
      );
    });

    const outstandingTotal = Array.from(latestApprovedByProject.entries()).reduce(
      (acc, [projectId, approvedAmount]) =>
        acc + Math.max(approvedAmount - (paidByProject.get(projectId) ?? 0), 0),
      0,
    );

    return {
      totalCollectedMonth: collectedMonth,
      totalCollectedAllTime: collectedAllTime,
      averageProjectValue: Number(averageQuotationValue._avg.grandTotal ?? 0),
      totalOutstanding: outstandingTotal,
      totalTransactions: paymentCount,
      collectionsByMode: paymentsByMode.map((entry) => ({
        mode: entry.mode,
        amount: Number(entry._sum.amount ?? 0),
      })),
      collectionsByType: paymentsByType.map((entry) => ({
        type: entry.type,
        amount: Number(entry._sum.amount ?? 0),
      })),
    };
  }

  async listPayments(filters: PaymentFilters) {
    return this.prisma.payment.findMany({
      where: {
        mode: filters.mode,
        type: filters.type,
        project: filters.projectCode
          ? {
              code: filters.projectCode,
            }
          : undefined,
      },
      orderBy: [
        { paymentDate: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        project: {
          select: {
            id: true,
            code: true,
            title: true,
            customer: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async createPayment(dto: CreatePaymentDto, user: AuthenticatedUser) {
    let projectId: string | undefined;
    let customerName = dto.customerName.trim();

    if (dto.projectCode?.trim()) {
      const project = await this.prisma.project.findUnique({
        where: {
          code: dto.projectCode.trim(),
        },
        select: {
          id: true,
          customer: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!project) {
        throw new NotFoundException('Project code not found');
      }

      projectId = project.id;
      customerName ||= project.customer.name;
    }

    return this.prisma.payment.create({
      data: {
        customerName,
        projectId,
        amount: dto.amount,
        mode: dto.mode,
        type: dto.type,
        paymentDate: new Date(dto.paymentDate),
        reference: dto.reference?.trim() || undefined,
        notes: dto.notes?.trim() || undefined,
        recordedById: user.sub,
      },
      include: {
        project: {
          select: {
            id: true,
            code: true,
            title: true,
            customer: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
