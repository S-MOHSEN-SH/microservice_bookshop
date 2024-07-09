import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { UserService } from './user.service';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
} from './common/dto/user.dto';
import { User } from './schema/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'register_user' })
  public async createUser(params: CreateUserDto): Promise<User> {
    console.log('i am in registeration part');
    return this.userService.createUser(params);
  }

  @MessagePattern({ cmd: 'user_login' })
  public async userLogin(params: LoginUserDto) {
    return this.userService.login(params);
  }

  @MessagePattern({ cmd: 'update_user' })
  public async updateUser(
    @Payload() data: { userId: string; params: UpdateUserDto },
  ): Promise<User> {
    return this.userService.updateUser(data.userId, data.params);
  }

  @MessagePattern({ cmd: 'delete_user' })
  public async deleteUser(@Payload() userId: string): Promise<string> {
    return this.userService.deleteUser(userId);
  }

  @MessagePattern({ cmd: 'find_user_by_id' })
  public async findUserById(@Payload() userId: string): Promise<User> {
    return this.userService.findUserById(userId);
  }
}
