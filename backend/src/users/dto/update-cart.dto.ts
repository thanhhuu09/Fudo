// users/dto/update-cart.dto.ts
import { IsInt, IsMongoId, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @ApiProperty({ description: 'The ID of the menu item' })
  @IsMongoId()
  menuItemId: string;

  @ApiProperty({ description: 'The quantity of the menu item' })
  @Min(0)
  @IsInt()
  quantity: number;
}
