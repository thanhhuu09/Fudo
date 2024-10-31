// src/user/dto/create-user.dto.ts
import { IsNotEmpty, IsEmail, MinLength, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  hash_password: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}
