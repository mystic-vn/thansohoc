import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  
  // Thêm CORS
  app.enableCors({
    origin: 'http://localhost:3000', // URL của frontend
    credentials: true,
  });
  
  await app.listen(3001);
}
bootstrap();
