import { ProjectPriority, ProjectStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Kulkarni Residence - Kitchen' })
  @IsString()
  title: string;

  @ApiProperty({ example: '3BHK modular kitchen and loft units' })
  @IsString()
  scope: string;

  @ApiProperty({ example: 'Modular Kitchen' })
  @IsString()
  furnitureType: string;

  @ApiProperty({ example: 'Pashan Area' })
  @IsString()
  location: string;

  @ApiProperty({ example: 'Flat 401, Green Heights' })
  @IsString()
  addressLine1: string;

  @ApiProperty({ example: 'Pune' })
  @IsString()
  city: string;

  @ApiPropertyOptional({ enum: ProjectStatus, default: ProjectStatus.INQUIRY })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({ enum: ProjectPriority, default: ProjectPriority.MEDIUM })
  @IsOptional()
  @IsEnum(ProjectPriority)
  priority?: ProjectPriority;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  customerId: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  leadId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @ApiPropertyOptional({ example: 145000 })
  @IsOptional()
  @IsNumber()
  estimatedValue?: number;

  @ApiPropertyOptional({ example: '2026-04-20' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-05-30' })
  @IsOptional()
  @IsDateString()
  expectedCompletionDate?: string;

  @ApiPropertyOptional({ example: 'Customer wants soft-close hardware.' })
  @IsOptional()
  @IsString()
  notes?: string;
}
