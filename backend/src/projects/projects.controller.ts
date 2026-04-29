import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectStatus, UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { CreateMeasurementSetDto } from './dto/create-measurement-set.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { MeasurementsService } from './measurements.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly measurementsService: MeasurementsService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List projects' })
  list(
    @Query('status') status?: ProjectStatus,
    @Query('search') search?: string,
  ) {
    return this.projectsService.list(status, search);
  }

  @Public()
  @Get('tracker/:code')
  @ApiOperation({ summary: 'Get public tracker details by project code' })
  getTrackerByCode(@Param('code') code: string) {
    return this.projectsService.getTrackerByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details' })
  getById(@Param('id') id: string) {
    return this.projectsService.getById(id);
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a project' })
  create(
    @Body() dto: CreateProjectDto,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    return this.projectsService.create(dto, user);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a project' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectsService.update(id, dto, user);
  }

  @Get(':id/measurements/current')
  @ApiOperation({ summary: 'Get current measurement set for a project' })
  getCurrentMeasurements(@Param('id') id: string) {
    return this.measurementsService.getCurrent(id);
  }

  @Post(':id/measurements')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new measurement set for a project' })
  createMeasurements(
    @Param('id') id: string,
    @Body() dto: CreateMeasurementSetDto,
  ) {
    return this.measurementsService.create(id, dto);
  }

  @Public()
  @Delete(':idOrCode')
  @ApiOperation({ summary: 'Delete a project' })
  remove(@Param('idOrCode') idOrCode: string) {
    return this.projectsService.remove(idOrCode);
  }
}
