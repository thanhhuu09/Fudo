// src/user/dto/update-user.dto.ts
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsEmail,
  MinLength,
  IsString,
  IsArray,
  ValidateNested,
  IsIn,
} from 'class-validator';

export class PaymentMethodDto {
  @IsString()
  type: string;

  @IsString()
  details: string;
}

export class UpdateUserDto {
  @IsOptional()
  @MinLength(6)
  hash_password?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  addresses?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentMethodDto)
  paymentMethods?: PaymentMethodDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  order_history?: string[];

  @IsOptional()
  @IsIn(['Active', 'Inactive'])
  account_status?: string;
}
