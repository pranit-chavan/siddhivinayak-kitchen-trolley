import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MeasurementRoomDto {
  @ApiProperty({ example: 'Kitchen' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 305 })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiPropertyOptional({ example: 244 })
  @IsOptional()
  @IsNumber()
  depth?: number;

  @ApiPropertyOptional({ example: 274 })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({ example: 'Window on east wall, sink under window' })
  @IsOptional()
  @IsString()
  wallNotes?: string;

  @ApiPropertyOptional({ example: [{ type: 'window', wall: 'east', width: 120 }] })
  @IsOptional()
  openings?: unknown;

  @ApiPropertyOptional({ example: [{ type: 'beam', wall: 'north', width: 30 }] })
  @IsOptional()
  obstacles?: unknown;
}

export class CreateMeasurementSetDto {
  @ApiPropertyOptional({ example: 'Initial site visit measurements' })
  @IsOptional()
  @IsString()
  siteNotes?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  measuredById?: string;

  @ApiProperty({
    type: [MeasurementRoomDto],
    example: [
      {
        name: 'Kitchen',
        width: 305,
        depth: 244,
        height: 274,
        wallNotes: 'Gas point on west wall',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MeasurementRoomDto)
  rooms: MeasurementRoomDto[];
}
