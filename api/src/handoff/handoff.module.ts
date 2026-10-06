import { Global, Module } from '@nestjs/common';
import { LogOwnerNotifier, OwnerNotifier } from './owner-notifier.js';

// Replaced by the WhatsApp + email notifier in the handoff milestone.
@Global()
@Module({
  providers: [{ provide: OwnerNotifier, useClass: LogOwnerNotifier }],
  exports: [OwnerNotifier],
})
export class HandoffModule {}
