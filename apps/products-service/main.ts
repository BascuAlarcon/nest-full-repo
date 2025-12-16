import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '../../libs/filters';
import { LoggingService } from '../../libs/logging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar validación global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Configurar exception filter global con logging
  const loggingService = new LoggingService();
  app.useGlobalFilters(new GlobalExceptionFilter(loggingService));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
