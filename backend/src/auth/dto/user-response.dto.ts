import { Exclude, Expose, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class UserResponseDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly role: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly photo: string;

  @Expose()
  readonly addresses: string[];

  @Expose()
  @Type(() => PaymentMethodResponseDto)
  readonly paymentMethods: {
    type: string;
    details: string;
  }[];

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
}

class PaymentMethodResponseDto {
  @Expose()
  readonly type: string;

  @Expose()
  readonly details: string;
}
