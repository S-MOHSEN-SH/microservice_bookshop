import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MailModule } from './mail.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MailModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://localhost:${new ConfigService().get('RABBITMQ_PORT')}`],
        queue: 'mail_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  app.listen();
  //() => console.log(`mailer microservice is listening `)
}
bootstrap();
