import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-intent')
  async createPaymentIntent(@Body() body: { amount: number }) {
    return this.paymentService.createPaymentIntent(body.amount, 'usd');
  }
}
