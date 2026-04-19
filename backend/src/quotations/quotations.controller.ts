import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuotationStatus, UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { UpdateQuotationStatusDto } from './dto/update-quotation-status.dto';
import { QuotationsService } from './quotations.service';

@ApiTags('quotations')
@ApiBearerAuth()
@Controller('quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Get()
  @ApiOperation({ summary: 'List quotations' })
  list(
    @Query('status') status?: QuotationStatus,
    @Query('projectId') projectId?: string,
  ) {
    return this.quotationsService.list(status, projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quotation details' })
  getById(@Param('id') id: string) {
    return this.quotationsService.getById(id);
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create quotation' })
  create(
    @Body() dto: CreateQuotationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.quotationsService.create(dto, user);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update quotation draft details' })
  update(@Param('id') id: string, @Body() dto: UpdateQuotationDto) {
    return this.quotationsService.update(id, dto);
  }

  @Patch(':id/status')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update quotation status and sync project workflow' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateQuotationStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.quotationsService.updateStatus(id, dto, user);
  }
}
