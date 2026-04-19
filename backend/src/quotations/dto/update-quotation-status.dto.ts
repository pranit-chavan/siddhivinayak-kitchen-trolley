import { QuotationStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateQuotationStatusDto {
  @ApiProperty({ enum: QuotationStatus })
  @IsEnum(QuotationStatus)
  status: QuotationStatus;

  @ApiPropertyOptional({ example: 'Shared with customer after final review.' })
  @IsOptional()
  @IsString()
  note?: string;
}
