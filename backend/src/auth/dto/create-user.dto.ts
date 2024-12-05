// src/user/dto/create-user.dto.ts
import { IsNotEmpty, IsEmail, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Invalid email address' })
  @ApiProperty()
  email: string;
}
