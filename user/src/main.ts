import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserModule } from './user.module';
import { ConfigService } from '@nestjs/config';

// async function bootstrap() {
//   const app = await NestFactory.create(UserModule);

//   const port = new ConfigService().get('USER_SERVICE_PORT');
//   app.connectMicroservice({
//     transport: Transport.TCP,
//     options: {
//       port: port,
//     },
//   });
//   await app.startAllMicroservices();
//   await app.listen(port, () => {
//     `User Service is listening on port ${port}`;
//   });
// }

async function bootstrap() {
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options:{
        port:5004,
       host: 'user_db'
      }
    },
  );
  await app.listen();
}

bootstrap();
