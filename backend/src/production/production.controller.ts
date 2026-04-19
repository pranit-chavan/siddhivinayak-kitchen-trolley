import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { UpdateProductionJobDto } from './dto/update-production-job.dto';
import { ProductionService } from './production.service';

@ApiTags('production')
@ApiBearerAuth()
@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Get('jobs')
  @ApiOperation({ summary: 'List live production jobs' })
  listJobs() {
    return this.productionService.listJobs();
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Put('jobs/project/:projectId')
  @ApiOperation({ summary: 'Create or update production workflow for a project' })
  upsertJob(
    @Param('projectId') projectId: string,
    @Body() dto: UpdateProductionJobDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.productionService.upsertJob(projectId, dto, user);
  }
}
