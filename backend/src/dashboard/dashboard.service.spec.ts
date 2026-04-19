import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  it('returns dashboard stats and a merged recent activity feed', async () => {
    const prisma = {
      project: {
        count: jest
          .fn()
          .mockResolvedValueOnce(8)
          .mockResolvedValueOnce(5),
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'project-1',
            code: 'SVK-2026-001',
            status: 'INQUIRY',
            createdAt: new Date('2026-04-17T10:00:00.000Z'),
            customer: { name: 'Meera Kulkarni' },
          },
        ]),
      },
      lead: {
        count: jest
          .fn()
          .mockResolvedValueOnce(14)
          .mockResolvedValueOnce(3),
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'lead-1-abcdef',
            fullName: 'Amit Wagh',
            status: 'NEW',
            createdAt: new Date('2026-04-18T10:00:00.000Z'),
          },
        ]),
      },
      quotation: {
        count: jest
          .fn()
          .mockResolvedValueOnce(11)
          .mockResolvedValueOnce(4),
        aggregate: jest.fn().mockResolvedValue({
          _sum: {
            grandTotal: 275000,
          },
        }),
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'quotation-1',
            code: 'QUO-SVK-26-001',
            status: 'APPROVED',
            createdAt: new Date('2026-04-16T10:00:00.000Z'),
            project: {
              code: 'SVK-2026-001',
              customer: { name: 'Meera Kulkarni' },
            },
          },
        ]),
      },
    } as any;

    const service = new DashboardService(prisma);
    const summary = await service.getSummary();

    expect(summary.stats).toEqual({
      activeProjects: 5,
      totalProjects: 8,
      newLeads: 3,
      totalLeads: 14,
      pendingQuotations: 4,
      totalQuotations: 11,
      approvedRevenue: 275000,
    });

    expect(summary.recentActivity).toEqual([
      {
        id: 'lead-1-abcdef',
        type: 'lead',
        reference: 'LEAD-1-A',
        customerName: 'Amit Wagh',
        message: 'Lead is currently New',
        createdAt: '2026-04-18T10:00:00.000Z',
      },
      {
        id: 'project-1',
        type: 'project',
        reference: 'SVK-2026-001',
        customerName: 'Meera Kulkarni',
        message: 'Project is currently in Inquiry',
        createdAt: '2026-04-17T10:00:00.000Z',
      },
      {
        id: 'quotation-1',
        type: 'quotation',
        reference: 'QUO-SVK-26-001',
        customerName: 'Meera Kulkarni',
        message: 'Quotation Approved for SVK-2026-001',
        createdAt: '2026-04-16T10:00:00.000Z',
      },
    ]);
  });
});
