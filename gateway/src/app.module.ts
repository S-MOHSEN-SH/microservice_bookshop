import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './controllers/user.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './common/guard/auth.guard';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BookController } from './controllers/book.controller';
import { HttpModule } from '@nestjs/axios';
import { OrderController } from './controllers/order.controller';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    AuthModule,
    HttpModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
  providers: [JwtService, ConfigService, JwtAuthGuard],
  controllers: [UserController, BookController, OrderController],
})
export class AppModule {}
