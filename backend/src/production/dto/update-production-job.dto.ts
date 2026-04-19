import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductionStage } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProductionJobDto {
  @ApiProperty({ enum: ProductionStage })
  @IsEnum(ProductionStage)
  currentStage: ProductionStage;

  @ApiProperty({ enum: ProductionStage, isArray: true })
  @IsArray()
  @IsEnum(ProductionStage, { each: true })
  completedStages: ProductionStage[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
