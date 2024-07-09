import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateOrderDto } from 'src/common/dto/order.dto';
import { Book } from 'src/common/entity/book.model';
import { OrderItem } from 'src/common/entity/order-item.model';
import { Order } from 'src/common/entity/order.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private readonly orderModel: typeof Order,
    @InjectModel(OrderItem) private readonly orderItemModel: typeof OrderItem,
    @InjectModel(Book) private readonly bookModel: typeof Book,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { customerId, orderItems } = createOrderDto;

    const orderDate = new Date();

    const bookIds = orderItems.map((item) => item.bookId);
    const books = await this.bookModel.findAll({ where: { id: bookIds } });
    const bookPrices = books.reduce((acc, book) => {
      acc[book.id] = book.price;
      return acc;
    }, {});

    const totalPrice = orderItems.reduce((acc, item) => {
      const bookPrice = bookPrices[item.bookId];
      if (!bookPrice) {
        throw new Error(`Book with id ${item.bookId} not found`);
      }
      return acc + bookPrice * item.quantity;
    }, 0);

    const order = await this.orderModel.create({
      customerId,
      orderDate,
      totalPrice,
    });

    const items = orderItems.map((item) => ({
      ...item,
      price: bookPrices[item.bookId],
      orderId: order.id,
    }));

    await this.orderItemModel.bulkCreate(items); // bulkCreate means you can create manyrecords at the same time

    return this.findOneOrder(order.id);
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.findAll({
      include: [OrderItem],
    });
  }

  async findOneOrder(id: number): Promise<Order> {
    return this.orderModel.findOne({
      where: { id },
      include: [OrderItem],
    });
  }

  async deleteOrder(id: number): Promise<void> {
    await this.orderItemModel.destroy({ where: { orderId: id } });
    await this.orderModel.destroy({
      where: { id },
    });
  }
}
