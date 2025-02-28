import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './schemas/order.schema';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() orderData: Partial<Order>): Promise<Order> {
    return this.orderService.createOrder(orderData);
  }

  @Get(':userId')
  async getOrdersByUser(@Param('userId') userId: string): Promise<Order[]> {
    return this.orderService.getOrdersByUser(userId);
  }

  @Patch(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: string,
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(orderId, status);
  }
}
