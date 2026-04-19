import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';
import { PrismaService } from './prisma/prisma.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Public()
  @ApiOkResponse({
    schema: {
      example: {
        status: 'ok',
        service: 'kitchen-trolley-backend',
      },
    },
  })
  getHealth() {
    return {
      status: 'ok',
      service: 'kitchen-trolley-backend',
    };
  }

  @Get('health/ready')
  @Public()
  @ApiOkResponse({
    schema: {
      example: {
        status: 'ok',
        service: 'kitchen-trolley-backend',
        database: 'connected',
      },
    },
  })
  async getReadiness() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: 'ok',
      service: 'kitchen-trolley-backend',
      database: 'connected',
    };
  }
}
