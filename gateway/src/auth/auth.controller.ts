import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto, LoginUserDto } from './dto/createUser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('USER_SERVICE') private readonly user_client: ClientProxy,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async registerUser(@Body() params: CreateUserDto) {
    try {
      const user = await this.user_client
        .send({ cmd: 'register_user' }, params)
        .toPromise();
      const token = await this.authService.getToken(user._id, user.role);
      return { user, token };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async userLogin(@Body() params: LoginUserDto) {
    try {
      const user = await this.user_client
        .send({ cmd: 'user_login' }, params)
        .toPromise();
      const token = await this.authService.getToken(user._id, user.role);
      return { user, token };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
}
