import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentMode, PaymentType, UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FinanceService } from './finance.service';

@ApiTags('finance')
@ApiBearerAuth()
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Public()
  @Get('summary')
  @ApiOperation({ summary: 'Get finance dashboard summary' })
  getSummary() {
    return this.financeService.getSummary();
  }

  @Public()
  @Get('payments')
  @ApiOperation({ summary: 'List recorded payments' })
  listPayments(
    @Query('mode') mode?: PaymentMode,
    @Query('type') type?: PaymentType,
    @Query('projectCode') projectCode?: string,
  ) {
    return this.financeService.listPayments({ mode, type, projectCode });
  }

  @Public()
  @Post('payments')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Record a payment' })
  createPayment(
    @Body() dto: CreatePaymentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.financeService.createPayment(dto, user);
  }
}
