// users/dto/update-cart.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class updateUserInfoDTO {
  @ApiProperty({ description: 'The new email of the user' })
  email: string;

  @ApiProperty({ description: 'The new password of the user' })
  password: string;

  @ApiProperty({ description: 'The new name of the user' })
  name: string;

  @ApiProperty({ description: 'The new address of the user' })
  addresses: string[];

  @ApiProperty({ description: 'The new phone number of the user' })
  phoneNumber: string;
}
