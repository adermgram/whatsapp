import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { env } from './config/env.js';
import { originCheck } from './common/origin-check.js';

async function bootstrap() {
  // rawBody: Paystack webhook signatures are computed over the exact bytes we receive.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  app.enableShutdownHooks(); // closes the WhatsApp socket cleanly on Ctrl+C

  app.set('trust proxy', 'loopback'); // the dashboard's server sits in front of us on this machine
  app.use(helmet()); // security headers on every response
  app.use(cookieParser());
  app.use(originCheck([env.DASHBOARD_ORIGIN]));

  await app.listen(env.PORT);
}
await bootstrap();
