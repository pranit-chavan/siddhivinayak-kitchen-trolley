import { LeadSource, LeadStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({ example: 'Meera Kulkarni' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 'meera@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Pashan Area' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: LeadSource, default: LeadSource.WEBSITE })
  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @ApiPropertyOptional({ example: 'Modular Kitchen' })
  @IsOptional()
  @IsString()
  interest?: string;

  @ApiPropertyOptional({ example: 120000 })
  @IsOptional()
  @IsNumber()
  budgetMin?: number;

  @ApiPropertyOptional({ example: 180000 })
  @IsOptional()
  @IsNumber()
  budgetMax?: number;

  @ApiPropertyOptional({ example: 'Customer needs a site visit this weekend.' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: LeadStatus, default: LeadStatus.NEW })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiPropertyOptional({ example: '2026-04-20T11:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  followUpAt?: string;
}
