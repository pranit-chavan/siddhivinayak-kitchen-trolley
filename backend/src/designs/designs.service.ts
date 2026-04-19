import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { SaveProjectDesignDto } from './dto/save-project-design.dto';
import { summarizeDesignItems } from './design-summary';

@Injectable()
export class DesignsService {
  constructor(private readonly prisma: PrismaService) {}

  async getByProjectId(projectId: string) {
    await this.prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      select: { id: true, code: true, title: true },
    });

    const design = await this.prisma.projectDesign.findUnique({
      where: { projectId },
    });

    if (!design) {
      return null;
    }

    return this.serializeDesign(design);
  }

  async saveByProjectId(
    projectId: string,
    dto: SaveProjectDesignDto,
    user: AuthenticatedUser,
  ) {
    await this.prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      select: { id: true },
    });

    const existingDesign = await this.prisma.projectDesign.findUnique({
      where: { projectId },
      select: {
        isPublished: true,
        publishedAt: true,
      },
    });

    const nextPublishedState = dto.isPublished ?? existingDesign?.isPublished ?? false;
    const nextPublishedAt =
      dto.isPublished === undefined
        ? existingDesign?.publishedAt ?? null
        : nextPublishedState
          ? existingDesign?.publishedAt ?? new Date()
          : null;

    const design = await this.prisma.projectDesign.upsert({
      where: { projectId },
      update: {
        roomWidth: dto.roomWidth,
        roomDepth: dto.roomDepth,
        roomHeight: dto.roomHeight,
        counterColor: dto.counterColor,
        items: dto.items as unknown as Prisma.InputJsonValue,
        isPublished: nextPublishedState,
        updatedById: user.sub,
        publishedAt: nextPublishedAt,
      },
      create: {
        projectId,
        roomWidth: dto.roomWidth,
        roomDepth: dto.roomDepth,
        roomHeight: dto.roomHeight,
        counterColor: dto.counterColor,
        items: dto.items as unknown as Prisma.InputJsonValue,
        isPublished: nextPublishedState,
        updatedById: user.sub,
        publishedAt: nextPublishedAt,
      },
    });

    return this.serializeDesign(design);
  }

  async getPublishedByProjectCode(projectCode: string) {
    const design = await this.prisma.projectDesign.findFirst({
      where: {
        isPublished: true,
        project: {
          code: projectCode,
        },
      },
      include: {
        project: {
          select: {
            code: true,
          },
        },
      },
    });

    if (!design) {
      throw new NotFoundException('Published design not found for this project');
    }

    return this.serializeDesign(design);
  }

  async getProjectSummary(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        code: true,
        title: true,
        customer: {
          select: {
            name: true,
          },
        },
        design: {
          select: {
            id: true,
            items: true,
            isPublished: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (!project.design) {
      return {
        projectId: project.id,
        projectCode: project.code,
        projectTitle: project.title,
        customerName: project.customer.name,
        hasDesign: false,
        isPublished: false,
        totalItems: 0,
        furnitureBreakdown: [],
        quotationSuggestions: [],
        cutlistSummary: {
          totalPanels: 0,
          totalSheetAreaSqM: 0,
          totalCountertopRft: 0,
        },
        updatedAt: null,
      };
    }

    return {
      projectId: project.id,
      projectCode: project.code,
      projectTitle: project.title,
      customerName: project.customer.name,
      hasDesign: true,
      isPublished: project.design.isPublished,
      updatedAt: project.design.updatedAt.toISOString(),
      ...summarizeDesignItems(project.design.items),
    };
  }

  private serializeDesign(design: {
    id: string;
    projectId: string;
    roomWidth: Prisma.Decimal;
    roomDepth: Prisma.Decimal;
    roomHeight: Prisma.Decimal;
    counterColor: string;
    items: Prisma.JsonValue;
    isPublished: boolean;
    publishedAt: Date | null;
    updatedAt: Date;
  }) {
    return {
      id: design.id,
      projectId: design.projectId,
      roomWidth: Number(design.roomWidth),
      roomDepth: Number(design.roomDepth),
      roomHeight: Number(design.roomHeight),
      counterColor: design.counterColor,
      items: design.items,
      isPublished: design.isPublished,
      publishedAt: design.publishedAt?.toISOString() ?? null,
      updatedAt: design.updatedAt.toISOString(),
    };
  }
}
