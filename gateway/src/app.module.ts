import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './controllers/user.controller';
import { JwtAuthGuard } from './common/guard/auth.guard';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BookController } from './book/book.controller';
import { HttpModule } from '@nestjs/axios';
import { OrderController } from './controllers/order.controller';
import { RedisModule } from './redis/redis.module';
import { CustomJwtService } from './common/jwt/jwt.service';
import { BookService } from './book/book.service';

@Module({
  imports: [
    AuthModule,
    HttpModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { 
          // port: new ConfigService().get('USER_SERVICE_PORT'),
          // host: new ConfigService().get('USER_SERVICE_HOST')
          port:5004,
          host:'localhost'
        },
      },
      {
        name: 'MAILER_SERVICE',
        transport: Transport.RMQ,
        options: {
          // urls: [`amqp://${new ConfigService().get('RABBITMQ_HOST')}:${new ConfigService().get('RABBITMQ_PORT')}`],
          queue: 'mail_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [CustomJwtService, ConfigService, JwtAuthGuard, BookService],
  controllers: [UserController, BookController, OrderController],
})
export class AppModule {}
