import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeasurementSetDto } from './dto/create-measurement-set.dto';

@Injectable()
export class MeasurementsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrent(projectId: string) {
    const measurement = await this.prisma.measurementSet.findFirst({
      where: {
        projectId,
        isCurrent: true,
      },
      include: {
        rooms: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        measuredBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!measurement) {
      throw new NotFoundException('No current measurement set found for this project');
    }

    return measurement;
  }

  async create(projectId: string, dto: CreateMeasurementSetDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const latestVersion = await tx.measurementSet.findFirst({
        where: { projectId },
        orderBy: { version: 'desc' },
        select: { version: true },
      });

      await tx.measurementSet.updateMany({
        where: { projectId, isCurrent: true },
        data: { isCurrent: false },
      });

      const measurementSet = await tx.measurementSet.create({
        data: {
          projectId,
          version: (latestVersion?.version ?? 0) + 1,
          isCurrent: true,
          siteNotes: dto.siteNotes,
          measuredById: dto.measuredById,
          rooms: {
            create: dto.rooms.map((room) => ({
              name: room.name,
              width: room.width,
              depth: room.depth,
              height: room.height,
              wallNotes: room.wallNotes,
              openings: room.openings as Prisma.InputJsonValue | undefined,
              obstacles: room.obstacles as Prisma.InputJsonValue | undefined,
            })),
          },
        },
        include: {
          rooms: true,
          measuredBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return measurementSet;
    });
  }
}
