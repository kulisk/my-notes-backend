import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { headers } from './middleware/headers.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(headers);
  app.enableCors();
  await app.listen(process.env.PORT || 5000);
}

bootstrap();
