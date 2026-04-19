import { PrismaService } from '../../prisma/prisma.service';

export async function generateProjectCode(prisma: PrismaService) {
  const year = new Date().getFullYear();
  const yearStart = new Date(`${year}-01-01T00:00:00.000Z`);
  const yearEnd = new Date(`${year + 1}-01-01T00:00:00.000Z`);

  const count = await prisma.project.count({
    where: {
      createdAt: {
        gte: yearStart,
        lt: yearEnd,
      },
    },
  });

  return `SVK-${year}-${String(count + 1).padStart(3, '0')}`;
}
