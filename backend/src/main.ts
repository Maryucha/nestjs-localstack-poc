import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const ENV = process.env.NODE_ENV || 'dev'; // 'dev', 'homolog', 'prod'
  dotenv.config({ path: `.env.${ENV}` });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  await app.listen(3000);
}
bootstrap();
