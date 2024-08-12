import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:[
      'http://localhost:5173'
    ],
    credentials:true
  });

  const port = new ConfigService().get('API_GATEWAY_PORT');

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());


  await app.listen(port, () => {
    `Gatway microservice is listening on port ${port}`;
  });
}
bootstrap();
