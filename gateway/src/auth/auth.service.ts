import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { timeConstants } from 'src/common/constants/time.constants';
import { LoginUserDto } from 'src/common/dto/login.dto';
import { CreateUserDto } from 'src/common/dto/user.dto';
import { Token } from 'src/common/interface/token.interface';
import { CustomJwtService } from 'src/common/jwt/jwt.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: CustomJwtService,
    private readonly configService: ConfigService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('MAILER_SERVICE') private readonly mailerClient: ClientProxy,
  ) {}

  async registerUser(createUserDto: CreateUserDto, res: Response) {
    const user = await this.userClient
      .send({ cmd: 'register_user' }, createUserDto)
      .toPromise();
    const token = await this.getToken(user._id, user.role);
    this.mailerClient.emit('send_registration_email', {
      to: user.email,
      name: user.fullname,
    });

    this.setCookies(res, token);
    return token;
  }

  async loginUser(loginUserDto: LoginUserDto, res: Response) {
    const user = await this.userClient
      .send({ cmd: 'user_login' }, loginUserDto)
      .toPromise();
    const token = await this.getToken(user._id, user.role);
    
    this.setCookies(res, token);
    return token;
  }

  private async getToken(userId: string, role: string): Promise<Token> {
    const accessToken = this.jwtService.sign(
      { userId, role },
      timeConstants.ACCESS_TOKEN_EXP,
      this.configService.get<string>('ACCESS_TOKEN_SECRET')!,
    );

    const refreshToken = this.jwtService.sign(
      { userId, role },
      timeConstants.REFRESH_TOKEN_EXP,
      this.configService.get<string>('REFRESH_TOKEN_SECRET')!,
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  private setCookies(res: Response, token: Token) {
    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: true, 
      maxAge: timeConstants.COOKIE_ACCES_EXP * 1000,
    });
    res.cookie('refresh_token', token.refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: timeConstants.COOKIE_REFRESH_EXP * 1000,
    });
  }

  async refreshTokens(refreshToken: string, res: Response): Promise<Token> {
    try {
      const payload = await this.jwtService.verify(
        refreshToken,
        this.configService.get<string>('REFRESH_TOKEN_SECRET')!,
      );
      const token = await this.getToken(payload.userId, payload.role);
      this.setCookies(res, token);
      return token;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
