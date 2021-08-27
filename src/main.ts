import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { headers } from './middleware/headers.middleware';
import { config } from 'aws-sdk';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from './const';

async function bootstrap() {
  config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
  const app = await NestFactory.create(AppModule);
  app.use(headers);
  app.enableCors();
  await app.listen(process.env.PORT || 5000);
}

bootstrap();
