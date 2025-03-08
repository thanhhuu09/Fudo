import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsMongoId, Min } from 'class-validator';

class AddressDTO {
  @ApiProperty({ description: 'Street of the address' })
  street: string;

  @ApiProperty({ description: 'City of the address' })
  city: string;

  @ApiProperty({ description: 'Country of the address' })
  country: string;

  @ApiProperty({ description: 'Zip code of the address' })
  zipCode: string;
}

class PaymentMethodDTO {
  @ApiProperty({ description: 'Type of the payment method' })
  type: string;

  @ApiProperty({ description: 'Details of the payment method' })
  details: string;
}

class CartItemDTO {
  @ApiProperty({ description: 'Menu item ID' })
  @IsMongoId()
  menuItemId: string;

  @ApiProperty({ description: 'Quantity of the menu item' })
  @Min(0)
  @IsInt()
  quantity: number;
}

export class updateUserInfoDTO {
  @ApiProperty({ description: 'The new email of the user' })
  email: string;

  @ApiProperty({ description: 'The new password of the user' })
  password: string;

  @ApiProperty({ description: 'The new name of the user' })
  name: string;

  @ApiProperty({
    description: 'The new addresses of the user',
    type: [AddressDTO],
  })
  addresses: AddressDTO[];

  @ApiProperty({ description: 'The new phone number of the user' })
  phoneNumber: string;

  @ApiProperty({
    description: 'The new payment methods of the user',
    type: [PaymentMethodDTO],
  })
  paymentMethods: PaymentMethodDTO[];

  @ApiProperty({
    description: 'The new cart of the user',
    type: [CartItemDTO],
  })
  cart: CartItemDTO[];

  @ApiProperty({ description: 'The new order history of the user' })
  orderHistory: string[];

  @ApiProperty({ description: 'The new photo of the user' })
  photo: string;

  @ApiProperty({ description: 'The new role of the user' })
  role: string;

  @ApiProperty({ description: 'The new google ID of the user' })
  googleId: string;

  @ApiProperty({ description: 'The new password hash of the user' })
  passwordHash: string;
}
