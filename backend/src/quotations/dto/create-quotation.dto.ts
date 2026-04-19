import { QuotationStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateQuotationItemDto {
  @ApiProperty({ example: '18mm BWR Plywood (Base Units)' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Plywood' })
  @IsString()
  category: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0)
  qty: number;

  @ApiProperty({ example: 'sqft' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 120 })
  @IsNumber()
  @Min(0)
  rate: number;
}

export class CreateQuotationDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  projectId: string;

  @ApiPropertyOptional({ enum: QuotationStatus, default: QuotationStatus.DRAFT })
  @IsOptional()
  @IsEnum(QuotationStatus)
  status?: QuotationStatus;

  @ApiPropertyOptional({ example: 18 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  gstRate?: number;

  @ApiPropertyOptional({ example: 'Includes transport and installation' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: '2026-05-10' })
  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @ApiProperty({ type: [CreateQuotationItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuotationItemDto)
  items: CreateQuotationItemDto[];
}
