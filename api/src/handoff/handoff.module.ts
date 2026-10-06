import { Global, Module } from '@nestjs/common';
import { HandoffService } from './handoff.service.js';
import { LogOwnerNotifier, OwnerNotifier } from './owner-notifier.js';

// OwnerNotifier is replaced by the WhatsApp + email notifier in the handoff milestone.
@Global()
@Module({
  providers: [HandoffService, { provide: OwnerNotifier, useClass: LogOwnerNotifier }],
  exports: [HandoffService, OwnerNotifier],
})
export class HandoffModule {}
