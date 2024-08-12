import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddOrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  bookId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
