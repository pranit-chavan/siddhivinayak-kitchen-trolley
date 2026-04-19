import { generateProjectCode } from './project-code';

describe('generateProjectCode', () => {
  it('builds the next project code for the current year', async () => {
    const count = jest.fn().mockResolvedValue(12);
    const prisma = {
      project: {
        count,
      },
    } as any;

    const code = await generateProjectCode(prisma);
    const currentYear = new Date().getFullYear();

    expect(code).toBe(`SVK-${currentYear}-013`);
    expect(count).toHaveBeenCalledWith({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      },
    });
  });
});
