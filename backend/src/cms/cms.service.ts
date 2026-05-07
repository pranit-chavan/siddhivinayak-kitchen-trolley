import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CmsService {
  constructor(private readonly prisma: PrismaService) {}

  getProducts() {
    return this.prisma.product.findMany({ orderBy: { priority: 'asc' } });
  }

  createProduct(data: any) {
    return this.prisma.product.create({ data });
  }

  updateProduct(id: string, data: any) {
    return this.prisma.product.update({ where: { id }, data });
  }

  deleteProduct(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  getPortfolio() {
    return this.prisma.portfolioItem.findMany({ orderBy: { priority: 'asc' } });
  }

  createPortfolio(data: any) {
    return this.prisma.portfolioItem.create({ data });
  }

  updatePortfolio(id: string, data: any) {
    return this.prisma.portfolioItem.update({ where: { id }, data });
  }

  deletePortfolio(id: string) {
    return this.prisma.portfolioItem.delete({ where: { id } });
  }
}
