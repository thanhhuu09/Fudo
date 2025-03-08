// users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

@Schema()
class Address {
  @Prop()
  street: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  zipCode: string;
}

@Schema()
export class User extends Document {
  @Prop({ required: true, default: Role.User, enum: Role })
  role: string;

  @Prop({ required: false, unique: true })
  googleId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: '' })
  photo: string;

  @Prop({ required: false })
  passwordHash: string;

  @Prop({ type: [Address] })
  addresses: Address[];

  @Prop({
    type: [{ type: String, details: String }],
    default: [],
  })
  paymentMethods: {
    type: string;
    details: string;
  }[];

  @Prop({ default: '' })
  phoneNumber: string;

  @Prop({ type: [Types.ObjectId], ref: 'Order', default: [] })
  orderHistory: Types.ObjectId[];

  @Prop({
    type: [
      {
        menuItem: { type: Types.ObjectId, ref: 'MenuItem' },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    default: [],
  })
  cart: {
    menuItem: Types.ObjectId;
    quantity: number;
  }[];

  @Prop({ default: 'Active' })
  accountStatus: string;

  @Prop({ default: [] })
  refreshTokens: string[];

  @Prop({ default: true })
  rememberMe: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
