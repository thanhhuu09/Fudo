// src/menu-item/dto/create-menu-item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({ description: 'The name of the menu item' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the menu item',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'The price of the menu item' })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'URL for the image of the menu item',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageURL?: string;

  @ApiProperty({ description: 'Whether the item is in stock' })
  @IsBoolean()
  inStock: boolean;

  @ApiProperty({
    description: 'The quantity of the menu item',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ description: 'Category ID for the menu item' })
  @IsString()
  categoryID: string;

  @ApiProperty({
    description: 'Whether the item is visible on the menu',
  })
  @IsBoolean()
  visible: boolean;
}
