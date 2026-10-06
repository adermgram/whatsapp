import { Module } from '@nestjs/common';
import { ReceiptService } from './receipt.service.js';

@Module({ providers: [ReceiptService], exports: [ReceiptService] })
export class ReceiptsModule {}
