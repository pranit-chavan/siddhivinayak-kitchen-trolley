import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { SaveProjectDesignDto } from './dto/save-project-design.dto';
import { DesignsService } from './designs.service';

@ApiTags('designs')
@ApiBearerAuth()
@Controller('designs')
export class DesignsController {
  constructor(private readonly designsService: DesignsService) {}

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get saved design for a project' })
  getByProjectId(@Param('projectId') projectId: string) {
    return this.designsService.getByProjectId(projectId);
  }

  @Get('project/:projectId/summary')
  @ApiOperation({ summary: 'Get structured design summary for downstream ERP modules' })
  getProjectSummary(@Param('projectId') projectId: string) {
    return this.designsService.getProjectSummary(projectId);
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Put('project/:projectId')
  @ApiOperation({ summary: 'Save or update project design' })
  saveByProjectId(
    @Param('projectId') projectId: string,
    @Body() dto: SaveProjectDesignDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.designsService.saveByProjectId(projectId, dto, user);
  }

  @Public()
  @Get('public/project-code/:projectCode')
  @ApiOperation({ summary: 'Get published design by public project code' })
  getPublishedByProjectCode(@Param('projectCode') projectCode: string) {
    return this.designsService.getPublishedByProjectCode(projectCode);
  }
}
