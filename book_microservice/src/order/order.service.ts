import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddOrderItemDto } from 'src/common/dto/addOrder.dto';
import { CreateOrderDto } from 'src/common/dto/createOrder.dto';
import { BookModel } from 'src/common/entity/book.model';
import { OrderItem } from 'src/common/entity/order-item.model';
import { Order } from 'src/common/entity/order.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private readonly orderModel: typeof Order,
    @InjectModel(OrderItem) private readonly orderItemModel: typeof OrderItem,
    @InjectModel(BookModel) private readonly bookModel: typeof BookModel,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const transaction = await this.orderModel.sequelize.transaction();
    try {
      const { customerId, orderItems } = createOrderDto;

      const order = await this.orderModel.create(
        { customerId, totalPrice: 0 },
        { transaction },
      );

      const bookIds = orderItems.map((item) => item.bookId);
      const books = await this.bookModel.findAll({
        where: { id: bookIds },
        transaction,
      });

      const items = orderItems.map((item) => {
        const book = books.find((b) => b.id === item.bookId);
        if (!book) {
          throw new Error(`Book with id ${item.bookId} not found`);
        }
        return {
          ...item,
          orderId: order.id,
        };
      });

      await this.orderItemModel.bulkCreate(items, { transaction });

      const orderWithTotalPrice = await this.orderModel.findOne({
        attributes: [
          'id',
          [
            this.orderModel.sequelize.fn(
              'SUM',
              this.orderModel.sequelize.literal(
                '"orderItems"."quantity" * "orderItems->book"."price"',
              ),
            ),
            'totalPrice',
          ],
        ],
        include: [
          {
            model: this.orderItemModel,
            attributes: [],
            include: [
              {
                model: this.bookModel,
                attributes: [],
              },
            ],
          },
        ],
        group: ['Order.id'],
        where: { id: order.id },
        raw: true,
        transaction,
      });

      await this.orderModel.update(
        { totalPrice: orderWithTotalPrice.totalPrice },
        { where: { id: order.id }, transaction },
      );

      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async addOrderItem(orderId: number, orderItemDto: AddOrderItemDto): Promise<Order> {
    const transaction = await this.orderModel.sequelize.transaction();
    try {
      const order = await this.orderModel.findByPk(orderId, { transaction });
      if (!order) {
        throw new NotFoundException(`Order with id ${orderId} not found`);
      }

      const book = await this.bookModel.findByPk(orderItemDto.bookId, { transaction });
      if (!book) {
        throw new NotFoundException(`Book with id ${orderItemDto.bookId} not found`);
      }

      const orderItem = {
        ...orderItemDto,
        orderId: order.id,
      };

      await this.orderItemModel.create(orderItem, { transaction });

      const updatedOrder = await this.orderModel.findOne({
        where: { id: order.id },
        include: [OrderItem],
        transaction,
      });

      await transaction.commit();
      return updatedOrder;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }




  async findAll(): Promise<Order[]> {
    return this.orderModel.findAll({
      include: [OrderItem],
    });
  }

  async findOneOrder(
    id: number,
    userId: string,
    userRole: string,
  ): Promise<Order> {
    const order = await this.orderModel.findOne({
      where: { id },
      include: [OrderItem],
    });

    if (!order) {
      throw new NotFoundException(`The order with id ${id} does not exist`);
    }
    if (order.customerId !== userId && userRole !== 'Admin') {
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    }
    return order;
  }

  async deleteOrder(id: number): Promise<void> {
    const transaction = await this.orderModel.sequelize!.transaction();

    try {
      await this.orderModel.destroy({
        where: { id },
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
