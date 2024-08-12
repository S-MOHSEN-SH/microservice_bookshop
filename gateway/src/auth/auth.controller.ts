import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../common/dto/login.dto';
import { CreateUserDto } from 'src/common/dto/user.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() params: CreateUserDto, @Res() res: Response) {
    const token = await this.authService.registerUser(params, res);
    return res.send(token);
  }

  @Post('login')
  async userLogin(@Body() params: LoginUserDto, @Res() res: Response) {
    try {
      const token = await this.authService.loginUser(params, res);
      return res.send(token);
    } catch (error) {
      return res.status(401).send({ error: `Login failed: ${error.message}` });
    }
  }

  @Post('refresh')
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken = req.cookies.refresh_token;
      const token = await this.authService.refreshTokens(refreshToken, res);
      return res.send(token);
    } catch (error) {
      return res.status(401).send({ error: `Token refresh failed: ${error.message}` });
    }
  }
}

