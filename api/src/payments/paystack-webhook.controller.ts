import {
  Controller,
  Headers,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaymentProvider } from './payment.provider.js';
import { PaymentConfirmationService } from './payment-confirmation.service.js';
import { decryptSecret } from '../config/secrets.js';

/** Each merchant points their Paystack webhook at /webhooks/paystack/<merchantId>. */
@Controller('webhooks')
export class PaystackWebhookController {
  private readonly log = new Logger(PaystackWebhookController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly provider: PaymentProvider,
    private readonly confirmation: PaymentConfirmationService,
  ) {}

  @Post('paystack/:merchantId')
  @HttpCode(200)
  async paystack(
    @Param('merchantId') merchantId: string,
    @Headers('x-paystack-signature') signature: string | undefined,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
      select: { paystackSecretEnc: true },
    });
    if (!merchant) throw new NotFoundException();
    const secret = merchant.paystackSecretEnc ? decryptSecret(merchant.paystackSecretEnc) : null;

    // The signature covers the exact bytes received, so use the raw body, never re-serialised JSON.
    if (!req.rawBody || !this.provider.isValidSignature(secret, req.rawBody, signature)) {
      throw new UnauthorizedException();
    }

    const event = JSON.parse(req.rawBody.toString('utf8')) as { event?: string; data?: { reference?: string } };
    const reference = event.data?.reference;
    if (event.event === 'charge.success' && reference) {
      // Answer Paystack immediately; the reconciler is the safety net if processing fails.
      void this.confirmation
        .confirm({ merchantId, reference, rawEvent: event })
        .catch((err) =>
          this.log.error(`Webhook confirm failed for ${reference}: ${err instanceof Error ? err.message : String(err)}`),
        );
    }
    return { received: true };
  }
}
