import { BadRequestException } from '@nestjs/common';
import { ProductionService } from './production.service';

describe('ProductionService', () => {
  it('rejects skipped stage updates so workshop flow stays sequential', async () => {
    const prisma = {
      project: {
        findUniqueOrThrow: jest.fn().mockResolvedValue({
          id: 'project-1',
          code: 'PRJ-001',
          title: 'Kitchen',
          furnitureType: 'Kitchen',
          customer: { name: 'Anaya' },
          design: null,
        }),
      },
    } as any;

    const service = new ProductionService(prisma);

    await expect(
      service.upsertJob(
        'project-1',
        {
          currentStage: 'CUTTING',
          completedStages: ['MATERIAL_ORDERED', 'CUTTING'],
          notes: 'Skipped receive step',
        },
        { sub: 'user-1', email: 'admin@example.com', role: 'ADMIN', name: 'Admin' },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
