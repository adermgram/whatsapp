import { Injectable } from '@nestjs/common';

export interface PaymentAlert {
  orderNumber: string;
  totalKobo: number;
  customerName: string | null;
  /** Set when something needs the owner's attention (oversold, amount mismatch, ...). */
  problem?: string;
}

export interface HandoffAlert {
  merchantId: string;
  conversationId: string;
  customerName: string | null;
  customerPhone: string;
  reason: string;
  /** Last few customer messages so the owner has context without opening the chat. */
  recent: string[];
}

/** Port. Real adapter alerts the owner by WhatsApp and email; Log adapter is for dev/tests. */
export abstract class OwnerNotifier {
  abstract notifyHandoff(alert: HandoffAlert): Promise<void>;
  abstract notifyMessageWhileHuman(
    merchantId: string,
    customerPhone: string,
    text: string,
  ): Promise<void>;
  abstract notifyPayment(
    merchantId: string,
    info: PaymentAlert,
  ): Promise<void>;
}

@Injectable()
export class LogOwnerNotifier extends OwnerNotifier {
  readonly alerts: unknown[] = [];

  async notifyHandoff(alert: HandoffAlert) {
    this.alerts.push({ type: 'handoff', ...alert });
  }
  async notifyMessageWhileHuman(merchantId: string, customerPhone: string, text: string) {
    this.alerts.push({ type: 'human-message', merchantId, customerPhone, text });
  }
  async notifyPayment(
    merchantId: string,
    info: PaymentAlert,
  ) {
    this.alerts.push({ type: 'payment', merchantId, ...info });
  }
}
