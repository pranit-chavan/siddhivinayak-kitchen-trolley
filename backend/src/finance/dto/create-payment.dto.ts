import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMode, PaymentType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 'Meera Kulkarni' })
  @IsString()
  customerName: string;

  @ApiPropertyOptional({ example: 'SVK-2026-001' })
  @IsOptional()
  @IsString()
  projectCode?: string;

  @ApiProperty({ example: 45000 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ enum: PaymentMode, example: PaymentMode.UPI })
  @IsEnum(PaymentMode)
  mode: PaymentMode;

  @ApiProperty({ enum: PaymentType, example: PaymentType.ADVANCE })
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty({ example: '2026-04-18' })
  @IsDateString()
  paymentDate: string;

  @ApiPropertyOptional({ example: 'TXN-293882' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({ example: 'Advance received at showroom.' })
  @IsOptional()
  @IsString()
  notes?: string;
}
