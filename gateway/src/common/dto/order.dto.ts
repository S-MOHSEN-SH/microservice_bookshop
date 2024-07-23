import { IsNotEmpty, IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true }) // to make sure that nested objects are also validated
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
