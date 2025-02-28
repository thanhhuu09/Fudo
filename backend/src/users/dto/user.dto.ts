import { Exclude, Expose } from 'class-transformer';

export class UserDTO {
  @Expose() id: string;
  @Expose() role: string;
  @Expose() name: string;
  @Expose() email: string;
  @Expose() photo: string;
  @Expose() addresses: string[];
  @Expose() orderHistory: any[];
  @Expose() accountStatus: string;
  @Expose() paymentMethods: any[];
  @Expose() cart: any[];
  @Expose() phoneNumber: string;
  @Expose() createdAt: Date;

  @Exclude() passwordHash: string;
  @Exclude() refreshTokens: string[];
  @Exclude() __v: number;

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
