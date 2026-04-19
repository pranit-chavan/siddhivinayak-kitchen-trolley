import { Injectable } from '@nestjs/common';
import {
  LeadStatus,
  ProjectStatus,
  QuotationStatus,
  type Lead,
  type Project,
  type Quotation,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type DashboardActivity = {
  id: string;
  type: 'lead' | 'project' | 'quotation';
  reference: string;
  customerName: string;
  message: string;
  createdAt: Date;
};

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [
      totalProjects,
      activeProjects,
      totalLeads,
      newLeads,
      overdueFollowUps,
      totalQuotations,
      pendingQuotations,
      approvedRevenueAggregate,
      trackerReadyProjects,
      projectsInProduction,
      recentProjects,
      recentLeads,
      recentQuotations,
    ] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.project.count({
        where: {
          status: {
            notIn: [ProjectStatus.COMPLETED, ProjectStatus.CANCELLED],
          },
        },
      }),
      this.prisma.lead.count(),
      this.prisma.lead.count({
        where: { status: LeadStatus.NEW },
      }),
      this.prisma.lead.count({
        where: {
          followUpAt: {
            lt: new Date(),
          },
          status: {
            notIn: [LeadStatus.CONVERTED, LeadStatus.LOST],
          },
        },
      }),
      this.prisma.quotation.count(),
      this.prisma.quotation.count({
        where: {
          status: {
            in: [QuotationStatus.DRAFT, QuotationStatus.SENT],
          },
        },
      }),
      this.prisma.quotation.aggregate({
        where: {
          status: QuotationStatus.APPROVED,
        },
        _sum: {
          grandTotal: true,
        },
      }),
      this.prisma.project.count({
        where: {
          design: {
            is: {
              isPublished: true,
            },
          },
        },
      }),
      this.prisma.project.count({
        where: {
          status: {
            in: [ProjectStatus.PRODUCTION, ProjectStatus.INSTALLATION],
          },
        },
      }),
      this.prisma.project.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              name: true,
            },
          },
        },
      }),
      this.prisma.lead.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.quotation.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          project: {
            select: {
              code: true,
              customer: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const recentActivity = [
      ...recentProjects.map((project) => this.mapProjectActivity(project)),
      ...recentLeads.map((lead) => this.mapLeadActivity(lead)),
      ...recentQuotations.map((quotation) =>
        this.mapQuotationActivity(quotation),
      ),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 6)
      .map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      }));

    return {
      stats: {
        activeProjects,
        totalProjects,
        newLeads,
        totalLeads,
        overdueFollowUps,
        pendingQuotations,
        totalQuotations,
        approvedRevenue: Number(approvedRevenueAggregate._sum.grandTotal ?? 0),
        trackerReadyProjects,
        projectsInProduction,
      },
      recentActivity,
    };
  }

  private mapProjectActivity(
    project: Project & { customer: { name: string } },
  ): DashboardActivity {
    return {
      id: project.id,
      type: 'project',
      reference: project.code,
      customerName: project.customer.name,
      message: `Project is currently in ${this.humanizeLabel(project.status)}`,
      createdAt: project.createdAt,
    };
  }

  private mapLeadActivity(lead: Lead): DashboardActivity {
    return {
      id: lead.id,
      type: 'lead',
      reference: lead.id.slice(0, 8).toUpperCase(),
      customerName: lead.fullName,
      message: `Lead is currently ${this.humanizeLabel(lead.status)}`,
      createdAt: lead.createdAt,
    };
  }

  private mapQuotationActivity(
    quotation: Quotation & { project: { code: string; customer: { name: string } } },
  ): DashboardActivity {
    return {
      id: quotation.id,
      type: 'quotation',
      reference: quotation.code,
      customerName: quotation.project.customer.name,
      message: `Quotation ${this.humanizeLabel(quotation.status)} for ${quotation.project.code}`,
      createdAt: quotation.createdAt,
    };
  }

  private humanizeLabel(value: string) {
    return value
      .split('_')
      .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
      .join(' ');
  }
}
