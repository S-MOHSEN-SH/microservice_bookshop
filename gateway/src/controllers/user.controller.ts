import {
  Body,
  Controller,
  Inject,
  Post,
  Put,
  Delete,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../common/guard/auth.guard';
import { UpdateUserDto } from '../common/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly user_client: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Put('update/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateUser(@Param('id') userId: string, @Body() params: UpdateUserDto) {
    try {
      const user = await this.user_client.send(
        { cmd: 'update_user' },
        { userId, params },
      );
      return user;
    } catch (error) {
      throw new Error(`Update failed: ${error.message}`);
    }
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') userId: string) {
    try {
      await this.user_client.send({ cmd: 'delete_user' }, userId);
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findUserById(@Param('id') userId: string) {
    try {
      const user = await this.user_client.send(
        { cmd: 'find_user_by_id' },
        userId,
      );
      return user;
    } catch (error) {
      throw new Error(`Find user failed: ${error.message}`);
    }
  }
}
