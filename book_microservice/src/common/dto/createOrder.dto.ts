import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateOrderItemDto } from './order.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true }) // to make sure that nested objects are also validated
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
