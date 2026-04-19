import { FinanceService } from './finance.service';

describe('FinanceService', () => {
  it('returns collection and outstanding summary values', async () => {
    const prisma = {
      payment: {
        aggregate: jest
          .fn()
          .mockResolvedValueOnce({ _sum: { amount: 95000 } })
          .mockResolvedValueOnce({ _sum: { amount: 150000 } }),
        count: jest.fn().mockResolvedValue(4),
        groupBy: jest
          .fn()
          .mockResolvedValueOnce([{ mode: 'UPI', _sum: { amount: 120000 } }])
          .mockResolvedValueOnce([
            { type: 'ADVANCE', _sum: { amount: 90000 } },
          ]),
      },
      quotation: {
        aggregate: jest
          .fn()
          .mockResolvedValueOnce({ _sum: { grandTotal: 225000 } })
          .mockResolvedValueOnce({ _avg: { grandTotal: 112500 } }),
      },
    } as any;

    const service = new FinanceService(prisma);
    const summary = await service.getSummary();

    expect(summary).toEqual({
      totalCollectedMonth: 95000,
      totalCollectedAllTime: 150000,
      averageProjectValue: 112500,
      totalOutstanding: 75000,
      totalTransactions: 4,
      collectionsByMode: [
        {
          mode: 'UPI',
          amount: 120000,
        },
      ],
      collectionsByType: [
        {
          type: 'ADVANCE',
          amount: 90000,
        },
      ],
    });
  });
});
