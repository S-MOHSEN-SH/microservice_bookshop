import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { urlConstants } from 'src/common/constants';
import { Roles } from 'src/common/decorator/role.decorator';
import { CreateOrderDto } from 'src/common/dto/order.dto';
import { Role } from 'src/common/enum/role.enum';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';

@Controller('order')
export class OrderController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  async showAllOrders() {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.configService.get<string>('ORDER_SERVICE_URL')}/${urlConstants.order}`,
      ),
    );
    return response.data;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  async showOrderById(@Param('id') id: number) {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.configService.get<string>('ORDER_SERVICE_URL')}/${urlConstants.order}/${id}`,
      ),
    );
    return response.data;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.configService.get<string>('ORDER_SERVICE_URL')}/${urlConstants.order}`,
        createOrderDto,
      ),
    );
    return response.data;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async deleteOrder(@Param('id') id: number) {
    const response = await firstValueFrom(
      this.httpService.delete(
        `${this.configService.get<string>('ORDER_SERVICE_URL')}/${urlConstants.order}/${id}`,
      ),
    );
    return response.data;
  }
}
