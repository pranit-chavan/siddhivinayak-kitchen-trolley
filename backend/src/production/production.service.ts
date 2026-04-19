import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, ProductionStage, ProjectStatus } from '@prisma/client';
import type { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProductionJobDto } from './dto/update-production-job.dto';

const DEFAULT_COMPLETED_STAGES: ProductionStage[] = [ProductionStage.MATERIAL_ORDERED];

@Injectable()
export class ProductionService {
  constructor(private readonly prisma: PrismaService) {}

  async listJobs() {
    const eligibleProjects = await this.prisma.project.findMany({
      where: {
        status: {
          in: [
            ProjectStatus.ORDER_CONFIRMED,
            ProjectStatus.PRODUCTION,
            ProjectStatus.INSTALLATION,
            ProjectStatus.COMPLETED,
          ],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: true,
        productionJob: true,
        design: {
          select: {
            id: true,
            isPublished: true,
          },
        },
      },
    });

    return Promise.all(
      eligibleProjects.map(async (project) => {
        const job =
          project.productionJob ??
          (await this.prisma.productionJob.create({
            data: {
              projectId: project.id,
              currentStage: ProductionStage.MATERIAL_ORDERED,
              completedStages: DEFAULT_COMPLETED_STAGES as unknown as Prisma.InputJsonValue,
            },
          }));

        return this.serializeJob(project, job);
      }),
    );
  }

  async upsertJob(
    projectId: string,
    dto: UpdateProductionJobDto,
    user: AuthenticatedUser,
  ) {
    const project = await this.prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      include: {
        customer: true,
        design: {
          select: {
            id: true,
            isPublished: true,
          },
        },
      },
    });

    const completedStages = this.normalizeCompletedStages(dto.completedStages);
    const expectedCurrentStage = this.resolveCurrentStage(completedStages);

    if (dto.currentStage !== expectedCurrentStage) {
      throw new BadRequestException(
        `Current stage must match the workflow sequence. Expected ${expectedCurrentStage}.`,
      );
    }

    const job = await this.prisma.productionJob.upsert({
      where: { projectId },
      update: {
        currentStage: dto.currentStage,
        completedStages: completedStages as unknown as Prisma.InputJsonValue,
        notes: dto.notes,
        updatedById: user.sub,
        completedAt:
          dto.currentStage === ProductionStage.READY ? new Date() : null,
      },
      create: {
        projectId,
        currentStage: dto.currentStage,
        completedStages: completedStages as unknown as Prisma.InputJsonValue,
        notes: dto.notes,
        updatedById: user.sub,
        completedAt:
          dto.currentStage === ProductionStage.READY ? new Date() : null,
      },
    });

    const mappedProjectStatus =
      dto.currentStage === ProductionStage.READY
        ? ProjectStatus.INSTALLATION
        : ProjectStatus.PRODUCTION;

    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        status: mappedProjectStatus,
      },
    });

    await this.syncProjectStatusHistory(
      projectId,
      project.status,
      mappedProjectStatus,
      job.currentStage,
      user,
    );

    return this.serializeJob(project, job);
  }

  private async syncProjectStatusHistory(
    projectId: string,
    previousStatus: ProjectStatus,
    nextStatus: ProjectStatus,
    currentStage: ProductionStage,
    user: AuthenticatedUser,
  ) {
    if (previousStatus === nextStatus) {
      return;
    }

    await this.prisma.projectStatusHistory.create({
      data: {
        projectId,
        status: nextStatus,
        note: `Synced from production stage: ${currentStage}`,
        changedById: user.sub,
      },
    });
  }

  private normalizeCompletedStages(completedStages: ProductionStage[]) {
    const orderedStages = Object.values(ProductionStage);
    const uniqueStages = Array.from(new Set(completedStages));
    const sortedStages = orderedStages.filter((stage) => uniqueStages.includes(stage));

    for (let index = 0; index < sortedStages.length; index += 1) {
      if (sortedStages[index] !== orderedStages[index]) {
        throw new BadRequestException(
          'Production stages must be completed in sequence without skipping steps',
        );
      }
    }

    return sortedStages;
  }

  private resolveCurrentStage(completedStages: ProductionStage[]) {
    const orderedStages = Object.values(ProductionStage);
    return (
      orderedStages[completedStages.length - 1] ??
      ProductionStage.MATERIAL_ORDERED
    );
  }

  private serializeJob(
    project: {
      id: string;
      code: string;
      title: string;
      furnitureType: string | null;
      customer: { name: string };
      design?: { id: string; isPublished: boolean } | null;
    },
    job: {
      id: string;
      currentStage: ProductionStage;
      completedStages: Prisma.JsonValue;
      notes: string | null;
      updatedAt: Date;
      createdAt: Date;
    },
  ) {
    return {
      id: job.id,
      projectId: project.id,
      projectCode: project.code,
      projectTitle: project.title,
      customerName: project.customer.name,
      furnitureType: project.furnitureType ?? 'Custom Furniture',
      hasDesign: Boolean(project.design?.id),
      designPublished: Boolean(project.design?.isPublished),
      currentStage: job.currentStage,
      completedStages: Array.isArray(job.completedStages)
        ? job.completedStages
        : [],
      notes: job.notes,
      updatedAt: job.updatedAt.toISOString(),
      createdAt: job.createdAt.toISOString(),
    };
  }
}
