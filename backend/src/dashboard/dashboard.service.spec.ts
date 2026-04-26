import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  it('returns dashboard stats and a merged recent activity feed', async () => {
    const prisma = {
      project: {
        count: jest
          .fn()
          // totalProjects
          .mockResolvedValueOnce(8)
          // activeProjects
          .mockResolvedValueOnce(5)
          // trackerReadyProjects
          .mockResolvedValueOnce(2)
          // projectsInProduction
          .mockResolvedValueOnce(3),
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
          // totalLeads
          .mockResolvedValueOnce(14)
          // newLeads
          .mockResolvedValueOnce(3)
          // overdueFollowUps
          .mockResolvedValueOnce(1),
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
          // totalQuotations
          .mockResolvedValueOnce(11)
          // pendingQuotations
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
      overdueFollowUps: 1,
      pendingQuotations: 4,
      totalQuotations: 11,
      approvedRevenue: 275000,
      trackerReadyProjects: 2,
      projectsInProduction: 3,
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
