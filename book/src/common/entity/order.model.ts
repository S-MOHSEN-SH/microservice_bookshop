import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany,
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
    allowNull: false,
  })
  customerId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  orderDate: Date;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  totalPrice: number;

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];
}
