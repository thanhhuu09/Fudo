// users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, default: 'user', enum: ['user', 'admin'] })
  role: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: '' })
  photo: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop({ default: [] })
  addresses: string[];

  @Prop({ type: [{ Object }], default: [] })
  paymentMethods: {
    type: string;
    details: string;
  }[];

  @Prop({ type: [Types.ObjectId], ref: 'Order', default: [] })
  order_history: Types.ObjectId[];

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
  account_status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
