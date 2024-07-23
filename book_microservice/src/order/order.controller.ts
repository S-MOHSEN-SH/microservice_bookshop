import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Headers,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from 'src/common/dto/createOrder.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOneOrder(
    @Param('id') id: number,
    @Headers('user-id') userId: string,
    @Headers('user-role') userRole: string,
  ): Promise<CreateOrderDto> {
    return this.orderService.findOneOrder(id, userId, userRole);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: number) {
    return this.orderService.deleteOrder(id);
  }
}
