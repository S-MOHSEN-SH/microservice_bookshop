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
export class BookModel extends Model<BookModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  author: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  price: number;

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];
}
