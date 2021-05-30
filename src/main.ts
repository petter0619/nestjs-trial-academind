import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from '../config.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(config.PORT);
}
bootstrap();
