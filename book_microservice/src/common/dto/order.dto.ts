import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  bookId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'The order quantity starts from 1' })
  quantity: number;
}
