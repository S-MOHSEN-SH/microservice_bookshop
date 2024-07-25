import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
} from 'sequelize-typescript';
import { Order } from './order.model';
import { BookModel } from './book.model';

@Table
export class OrderItem extends Model<OrderItem> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  orderId: number;

  @ForeignKey(() => BookModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  bookId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @BelongsTo(() => Order, { onDelete: 'CASCADE' })
  order: Order;

  @BelongsTo(() => BookModel)
  book: BookModel;
}
