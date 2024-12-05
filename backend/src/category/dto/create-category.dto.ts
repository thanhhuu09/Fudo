import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'The name of the category' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the category',
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;
}
