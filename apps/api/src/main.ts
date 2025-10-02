import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || undefined;
  await app.listen(port, host);
}

void bootstrap();
