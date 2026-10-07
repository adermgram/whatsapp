import { Injectable } from '@nestjs/common';

export interface PaymentAlert {
  orderNumber: string;
  totalKobo: number;
  customerName: string | null;
  /** Set when something needs the owner's attention (oversold, amount mismatch, ...). */
  problem?: string;
}

export interface ProofFile {
  data: Buffer;
  mimeType: string;
  fileName: string;
  kind: 'image' | 'pdf';
}

export interface PaymentProofAlert {
  orderNumber: string;
  totalKobo: number;
  customerName: string | null;
  customerPhone: string;
  /** The customer's own words with the file, already cleaned. */
  caption?: string;
  /** The file itself. Absent when it could not be fetched, in which case only a text alert goes out. */
  file?: ProofFile;
}

export interface HandoffAlert {
  merchantId: string;
  conversationId: string;
  customerName: string | null;
  customerPhone: string;
  reason: string;
  /** 'handoff' = the AI stopped replying; 'attention' = the owner should know, but the AI is still chatting. */
  kind?: 'handoff' | 'attention';
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
  /**
   * A customer sent what looks like proof of payment. Passes the file to the owner so they can check their bank
   * and reply /paid. Returns true only if the FILE itself reached the owner. Never confirms anything by itself.
   */
  abstract notifyPaymentProof(merchantId: string, alert: PaymentProofAlert): Promise<boolean>;
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
  /** Tests can set this to false to simulate the owner's WhatsApp being unreachable. */
  forwardWorks = true;

  async notifyPaymentProof(merchantId: string, alert: PaymentProofAlert) {
    const { file, ...rest } = alert;
    this.alerts.push({
      type: 'payment-proof',
      merchantId,
      ...rest,
      file: file ? { kind: file.kind, mimeType: file.mimeType, fileName: file.fileName, size: file.data.length } : undefined,
    });
    return this.forwardWorks && !!file;
  }

  async notifyPayment(
    merchantId: string,
    info: PaymentAlert,
  ) {
    this.alerts.push({ type: 'payment', merchantId, ...info });
  }
}
