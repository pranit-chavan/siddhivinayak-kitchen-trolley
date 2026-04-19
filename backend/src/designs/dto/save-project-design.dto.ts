import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsHexColor,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

class DesignItemDto {
  @ApiProperty()
  @IsString()
  uid: string;

  @ApiProperty()
  @IsString()
  pieceId: string;

  @ApiProperty()
  piece: Record<string, unknown>;

  @ApiProperty()
  @IsNumber()
  x: number;

  @ApiProperty()
  @IsNumber()
  z: number;

  @ApiProperty()
  @IsNumber()
  rotationY: number;

  @ApiProperty()
  @IsHexColor()
  color: string;

  @ApiProperty()
  @IsHexColor()
  counterColor: string;
}

export class SaveProjectDesignDto {
  @ApiProperty()
  @IsNumber()
  roomWidth: number;

  @ApiProperty()
  @IsNumber()
  roomDepth: number;

  @ApiProperty()
  @IsNumber()
  roomHeight: number;

  @ApiProperty()
  @IsHexColor()
  counterColor: string;

  @ApiProperty({ type: [DesignItemDto] })
  @IsArray()
  items: DesignItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
