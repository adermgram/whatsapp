import { Module } from '@nestjs/common';
import { ProductsAdminService } from './products.service.js';
import { ProductsController } from './products.controller.js';

/** The owner's dashboard API. Login lives in AuthModule; everything here requires it. */
@Module({
  controllers: [ProductsController],
  providers: [ProductsAdminService],
  exports: [ProductsAdminService],
})
export class AdminModule {}
