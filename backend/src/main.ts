import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  
  // Thêm CORS với nhiều origin
  app.enableCors({
    origin: ['http://localhost:3000', 'https://thansohoc.mystic.vn'], // Chấp nhận cả local và production
    credentials: true,
  });
  
  await app.listen(3001);
}
bootstrap();
