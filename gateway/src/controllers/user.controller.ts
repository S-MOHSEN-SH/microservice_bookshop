import {
  Body,
  Controller,
  Inject,
  Put,
  Delete,
  Get,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../common/guard/auth.guard';
import { CreateUserDto } from 'src/common/dto/user.dto';
import { User } from 'src/common/decorator/user.decorator';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorator/role.decorator';
@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly user_client: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  @Put('update/:id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') userId: string,
    @Body() params: Partial<CreateUserDto>,
  ) {
    try {
      const user = this.user_client.send(
        { cmd: 'update_user' },
        { userId, params },
      );
      return user;
    } catch (error) {
      throw new Error(`Update failed: ${error.message}`);
    }
  }

  // @Delete('delete/:id')
  // @UseGuards(JwtAuthGuard)
  // async deleteUser(
  //   @Param('id') userId: string,
  //   @Body('password') password: string,
  //   @Request() req: Request,
  // ) {
  //   try {
  //     const requesterId = req.user.userId;
  //     const role = req.user.role;

  //     const payload =
  //       role === 'admin'
  //         ? { userId, requesterId }
  //         : { userId, requesterId, password };

  //     const result = await this.user_client
  //       .send({ cmd: 'delete_user' }, payload)
  //       .toPromise();

  //     return result;
  //   } catch (error) {
  //     throw new Error(`Delete failed: ${error.message}`);
  //   }
  // }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async deleteUser(
    @Param('id') userId: string,
    @User('role') requesterRole: string,
    @User('userId') requesterId: string,
    @Body('password') password?: string,
  ) {
    try {
      if (requesterRole !== 'admin' && requesterId !== userId) {
        throw new ForbiddenException('You can only delete your own account.');
      }
      const payload =
        requesterRole === 'admin'
          ? { userId, requesterId }
          : { userId, requesterId, password };

      const result = await this.user_client
        .send({ cmd: 'delete_user' }, payload)
        .toPromise();
      return result;
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
