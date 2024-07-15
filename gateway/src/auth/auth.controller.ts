import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../common/dto/login.dto';
import { CreateUserDto } from 'src/common/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() params: CreateUserDto) {
    try {
      return await this.authService.registerUser(params);
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  @Post('login')
  async userLogin(@Body() params: LoginUserDto) {
    try {
      return await this.authService.loginUser(params);
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  @Post('refresh')
  async refreshTokens(@Body('refresh_token') refreshToken: string) {
    try {
      return await this.authService.refreshTokens(refreshToken);
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }
}
