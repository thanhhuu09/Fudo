import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class AppModule {}
