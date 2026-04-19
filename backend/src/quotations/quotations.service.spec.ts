import { BadRequestException } from '@nestjs/common';
import { QuotationsService } from './quotations.service';

describe('QuotationsService', () => {
  it('moves the linked project to quotation sent when a quotation is marked sent', async () => {
    const projectUpdate = jest.fn().mockResolvedValue(undefined);
    const historyCreate = jest.fn().mockResolvedValue(undefined);
    const quotationUpdate = jest.fn().mockResolvedValue({
      id: 'quotation-1',
      code: 'QUO-SVK-26-001',
      status: 'SENT',
    });

    const prisma = {
      quotation: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'quotation-1',
          projectId: 'project-1',
          status: 'DRAFT',
        }),
      },
      $transaction: jest.fn().mockImplementation(async (callback) =>
        callback({
          quotation: {
            update: quotationUpdate,
            findUniqueOrThrow: jest.fn().mockResolvedValue({
              id: 'quotation-1',
              code: 'QUO-SVK-26-001',
              status: 'SENT',
              project: {
                customer: {
                  name: 'Meera Kulkarni',
                },
              },
              items: [],
            }),
          },
          project: {
            update: projectUpdate,
          },
          projectStatusHistory: {
            create: historyCreate,
          },
        }),
      ),
    } as any;

    const service = new QuotationsService(prisma);

    const result = await service.updateStatus(
      'quotation-1',
      { status: 'SENT', note: 'Sent to customer' },
      { sub: 'user-1', email: 'owner@example.com', role: 'OWNER', name: 'Owner' },
    );

    expect(projectUpdate).toHaveBeenCalledWith({
      where: { id: 'project-1' },
      data: { status: 'QUOTATION_SENT' },
    });
    expect(historyCreate).toHaveBeenCalledWith({
      data: {
        projectId: 'project-1',
        status: 'QUOTATION_SENT',
        note: 'Sent to customer',
        changedById: 'user-1',
      },
    });
    expect(result.status).toBe('SENT');
  });

  it('rejects invalid backwards transitions after approval', async () => {
    const prisma = {
      quotation: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'quotation-1',
          projectId: 'project-1',
          status: 'APPROVED',
        }),
      },
    } as any;

    const service = new QuotationsService(prisma);

    await expect(
      service.updateStatus(
        'quotation-1',
        { status: 'DRAFT' },
        { sub: 'user-1', email: 'owner@example.com', role: 'OWNER', name: 'Owner' },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
