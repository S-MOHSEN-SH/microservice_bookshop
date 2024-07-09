import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from 'src/common/entity/order.model';
import { OrderItem } from 'src/common/entity/order-item.model';
import { Book } from 'src/common/entity/book.model';

@Module({
  imports: [SequelizeModule.forFeature([Order, OrderItem, Book])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
