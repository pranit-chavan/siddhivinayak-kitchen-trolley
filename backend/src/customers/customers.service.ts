import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  list(search?: string) {
    return this.prisma.customer.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            projects: true,
            leads: true,
          },
        },
      },
    });
  }

  async create(dto: CreateCustomerDto) {
    const existingCustomer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          { phone: dto.phone },
          ...(dto.email
            ? [{ email: dto.email.toLowerCase() }]
            : []),
        ],
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        location: true,
        addressLine1: true,
        city: true,
        notes: true,
      },
    });

    if (existingCustomer) {
      throw new ConflictException(
        'A customer with this phone number or email already exists',
      );
    }

    return this.prisma.customer.create({
      data: {
        ...dto,
        name: dto.name.trim(),
        phone: dto.phone.trim(),
        email: dto.email?.toLowerCase(),
      },
    });
  }
}
