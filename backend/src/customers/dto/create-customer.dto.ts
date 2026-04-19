import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Meera Kulkarni' })
  @IsString()
  name: string;

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

  @ApiPropertyOptional({ example: 'Flat 401, Green Heights' })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiPropertyOptional({ example: 'Pune' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Prefers matte laminate finish' })
  @IsOptional()
  @IsString()
  notes?: string;
}
