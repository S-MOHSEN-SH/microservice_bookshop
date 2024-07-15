import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = new ConfigService().get('BOOK_MICROSERVICE_PORT');

  await app.startAllMicroservices();
  await app.listen(port, () => {
    console.log(`Book Microservice is listening on port ${port}}`);
  });
}
bootstrap();
