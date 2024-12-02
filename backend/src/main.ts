import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const ENV = process.env.NODE_ENV || 'dev'; // 'dev', 'homolog', 'prod'
  dotenv.config({ path: `.env.${ENV}` });
  await app.listen(3000);
}
bootstrap();
