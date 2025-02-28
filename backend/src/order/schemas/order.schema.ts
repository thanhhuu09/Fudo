import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [{ menuItem: String, quantity: Number }], required: true })
  items: { menuItem: string; quantity: number }[];

  @Prop({
    required: true,
    enum: ['pending', 'preparing', 'out_for_delivery', 'delivered'],
    default: 'pending',
  })
  status: string;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  paymentMethod: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
