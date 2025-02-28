import { Injectable } from '@nestjs/common';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const newOrder = new this.orderModel(orderData);
    return newOrder.save();
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).exec();
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    return this.orderModel
      .findByIdAndUpdate(orderId, { status }, { new: true })
      .exec();
  }
}
