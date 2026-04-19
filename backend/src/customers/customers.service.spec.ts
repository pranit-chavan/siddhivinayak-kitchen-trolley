import { ConflictException } from '@nestjs/common';
import { CustomersService } from './customers.service';

describe('CustomersService', () => {
  it('rejects duplicate customers by phone', async () => {
    const prisma = {
      customer: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'customer-1',
        }),
      },
    } as any;

    const service = new CustomersService(prisma);

    await expect(
      service.create({
        name: 'Meera Kulkarni',
        phone: '9876543210',
        email: 'meera@example.com',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
