import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    JwtModule.register({}),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { port: 5001 },
      },
      {
        name: 'MAILER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'mail_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [JwtService, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
