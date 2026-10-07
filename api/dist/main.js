import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { env } from './config/env.js';
import { originCheck } from './common/origin-check.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, { rawBody: true });
    app.enableShutdownHooks();
    app.set('trust proxy', 'loopback');
    app.use(helmet());
    app.use(cookieParser());
    app.use(originCheck([env.DASHBOARD_ORIGIN]));
    await app.listen(env.PORT);
}
await bootstrap();
//# sourceMappingURL=main.js.map