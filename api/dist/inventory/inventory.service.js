var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let InventoryService = class InventoryService {
    async reserve(tx, variantId, qty) {
        const rows = await tx.$executeRaw `
      UPDATE "Variant" SET reserved = reserved + ${qty}
      WHERE id = ${variantId} AND stock - reserved >= ${qty}`;
        return rows === 1;
    }
    async release(tx, variantId, qty) {
        await tx.$executeRaw `
      UPDATE "Variant" SET reserved = GREATEST(reserved - ${qty}, 0)
      WHERE id = ${variantId}`;
    }
    async commit(tx, variantId, qty) {
        await tx.$executeRaw `
      UPDATE "Variant"
      SET stock = GREATEST(stock - ${qty}, 0), reserved = GREATEST(reserved - ${qty}, 0)
      WHERE id = ${variantId}`;
    }
    async takeUnreserved(tx, variantId, qty) {
        const rows = await tx.$executeRaw `
      UPDATE "Variant" SET stock = stock - ${qty}
      WHERE id = ${variantId} AND stock - reserved >= ${qty}`;
        return rows === 1;
    }
};
InventoryService = __decorate([
    Injectable()
], InventoryService);
export { InventoryService };
//# sourceMappingURL=inventory.service.js.map