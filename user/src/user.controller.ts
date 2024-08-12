import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { UserService } from './user.service';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
} from './common/dto/user.dto';
import { User } from './schema/user.schema';
import { updateUser } from './common/interface/updateUser.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'register_user' })
  public async createUser(
    params: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.userService.createUser(params);
  }

  @MessagePattern({ cmd: 'user_login' })
  public async userLogin(params: LoginUserDto) {
    return this.userService.login(params);
  }

  @MessagePattern({ cmd: 'update_user' })
  public async updateUser(
    @Payload() data: updateUser,
  ): Promise<Omit<User, 'password'>> {
    return this.userService.updateUser(data.userId, data.params);
  }

  @MessagePattern({ cmd: 'delete_user' })
  public async deleteUser(
    @Payload() data: { userId: string; requesterId: string; password?: string },
  ): Promise<string> {
    const { userId, requesterId, password } = data;
    return this.userService.deleteUser(userId, requesterId, password);
  }

  @MessagePattern({ cmd: 'find_user_by_id' })
  public async findUserById(@Payload() userId: string): Promise<Omit<User, 'password'>> {
    return this.userService.findUserById(userId);
  }

  @MessagePattern({cmd:'go_to_user_dashboard'})
  public async userProfile(@Payload() userId:string): Promise<Omit<User, 'password'>>{
    return this.userService.findAuthUser(userId)
  }

  @MessagePattern({ cmd: 'find_all_users' })
  public async findAllUsers(): Promise<Omit<User, 'password'>[]> {
    return this.userService.findAllUsers();
  }
}
