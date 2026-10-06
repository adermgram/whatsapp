import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { env } from './config/env.js';

async function bootstrap() {
  // rawBody: Paystack webhook signatures are computed over the exact bytes we receive.
  const app = await NestFactory.create(AppModule, { rawBody: true });
  await app.listen(env.PORT);
}
await bootstrap();
