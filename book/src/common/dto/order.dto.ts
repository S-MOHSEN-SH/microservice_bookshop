import {
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsArray,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  bookId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true }) // to make sure that nested objects are also validated
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
