import { Global, Module } from '@nestjs/common';
import { LocalStorage } from './local.storage.js';
import { StoragePort } from './storage.port.js';

@Global()
@Module({
  providers: [{ provide: StoragePort, useClass: LocalStorage }],
  exports: [StoragePort],
})
export class StorageModule {}
