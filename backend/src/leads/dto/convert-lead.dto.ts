import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ConvertLeadDto {
  @ApiProperty({ example: 'Kulkarni Residence - Kitchen' })
  @IsString()
  projectTitle: string;

  @ApiPropertyOptional({ example: 'Full modular kitchen with lofts' })
  @IsOptional()
  @IsString()
  scope?: string;

  @ApiPropertyOptional({ example: 'Modular Kitchen' })
  @IsOptional()
  @IsString()
  furnitureType?: string;

  @ApiPropertyOptional({ example: 'Pashan Area' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'Flat 401, Green Heights' })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiPropertyOptional({ example: 'Pune' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 145000 })
  @IsOptional()
  @IsNumber()
  estimatedValue?: number;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @ApiPropertyOptional({ example: 'Converted after successful site visit call.' })
  @IsOptional()
  @IsString()
  notes?: string;
}
