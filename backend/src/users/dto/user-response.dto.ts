import { Exclude, Expose } from 'class-transformer';
import { Types } from 'mongoose';

class AddressResponseDto {
  @Expose()
  readonly street: string;

  @Expose()
  readonly city: string;

  @Expose()
  readonly country: string;

  @Expose()
  readonly zipCode: string;
}

class PaymentMethodResponseDto {
  @Expose()
  readonly type: string;

  @Expose()
  readonly details: string;
}

export class UserResponseDto {
  @Expose()
  readonly _id: string;

  @Expose()
  readonly googleId: string;

  @Expose()
  readonly role: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly photo: string;

  @Expose()
  readonly addresses: AddressResponseDto[];

  @Expose()
  readonly phoneNumber: string;

  @Expose()
  readonly paymentMethods: PaymentMethodResponseDto[];

  @Expose()
  readonly orderHistory: Types.ObjectId[];

  @Expose()
  readonly cart: {
    menuItem: Types.ObjectId;
    quantity: number;
  }[];

  @Expose()
  readonly accountStatus: string;

  @Expose()
  readonly createdAt: Date;

  @Exclude() // Sensitive information is excluded
  readonly passwordHash: string;

  @Exclude()
  readonly refreshTokens: string[];
}
