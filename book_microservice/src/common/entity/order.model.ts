import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  Default,
} from 'sequelize-typescript';
import { OrderItem } from './order-item.model';

@Table
export class Order extends Model<Order> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  customerId: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  orderDate: Date;

  @Column({
    type: DataType.DECIMAL,
    allowNull: true,
  })
  totalPrice: number;

  @HasMany(() => OrderItem, { onDelete: 'CASCADE' })
  orderItems: OrderItem[];
}
