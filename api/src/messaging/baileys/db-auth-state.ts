import { BufferJSON, initAuthCreds, proto } from '@whiskeysockets/baileys';
import type { AuthenticationCreds, AuthenticationState, SignalDataSet, SignalDataTypeMap } from '@whiskeysockets/baileys';
import type { PrismaService } from '../../prisma/prisma.service.js';

const CREDS_KEY = 'creds';

/**
 * Baileys auth state stored in Postgres (table WaAuthItem) instead of a folder of files, so the WhatsApp
 * login survives restarts, redeploys and hosts with no persistent disk. Same contract as Baileys'
 * own useMultiFileAuthState: one row per key, values serialised with BufferJSON so Buffers round-trip.
 */
export async function useDbAuthState(prisma: PrismaService, merchantId: string) {
  const read = async (key: string) => {
    const row = await prisma.waAuthItem.findUnique({ where: { merchantId_key: { merchantId, key } } });
    return row ? JSON.parse(row.value, BufferJSON.reviver) : null;
  };

  const creds: AuthenticationCreds = (await read(CREDS_KEY)) ?? initAuthCreds();

  const state: AuthenticationState = {
    creds,
    keys: {
      get: async <T extends keyof SignalDataTypeMap>(type: T, ids: string[]) => {
        const rows = await prisma.waAuthItem.findMany({
          where: { merchantId, key: { in: ids.map((id) => `${type}-${id}`) } },
        });
        const byKey = new Map(rows.map((r) => [r.key, r.value]));
        const out: { [id: string]: SignalDataTypeMap[T] } = {};
        for (const id of ids) {
          const raw = byKey.get(`${type}-${id}`);
          if (raw === undefined) continue;
          let value = JSON.parse(raw, BufferJSON.reviver);
          if (type === 'app-state-sync-key' && value) value = proto.Message.AppStateSyncKeyData.fromObject(value);
          out[id] = value;
        }
        return out;
      },

      set: async (data: SignalDataSet) => {
        const upsertKeys: string[] = [];
        const upsertValues: string[] = [];
        const deleteKeys: string[] = [];
        for (const category of Object.keys(data) as (keyof SignalDataTypeMap)[]) {
          const items = data[category] ?? {};
          for (const id of Object.keys(items)) {
            const value = items[id];
            const key = `${category}-${id}`;
            if (value) {
              upsertKeys.push(key);
              upsertValues.push(JSON.stringify(value, BufferJSON.replacer));
            } else deleteKeys.push(key);
          }
        }
        // One round trip each (the database is remote), not one per key.
        if (upsertKeys.length) {
          await prisma.$executeRaw`
            INSERT INTO "WaAuthItem" ("merchantId", "key", "value")
            SELECT ${merchantId}, t.k, t.v FROM unnest(${upsertKeys}::text[], ${upsertValues}::text[]) AS t(k, v)
            ON CONFLICT ("merchantId", "key") DO UPDATE SET "value" = EXCLUDED."value"`;
        }
        if (deleteKeys.length) {
          await prisma.waAuthItem.deleteMany({ where: { merchantId, key: { in: deleteKeys } } });
        }
      },
    },
  };

  return {
    state,
    saveCreds: async () => {
      const value = JSON.stringify(creds, BufferJSON.replacer);
      await prisma.waAuthItem.upsert({
        where: { merchantId_key: { merchantId, key: CREDS_KEY } },
        create: { merchantId, key: CREDS_KEY, value },
        update: { value },
      });
    },
    /** Forget this login completely (after the phone logs the device out). */
    clear: async () => {
      await prisma.waAuthItem.deleteMany({ where: { merchantId } });
    },
  };
}

/** True when a login (creds) is stored for this merchant, i.e. no QR is needed on startup. */
export async function hasStoredLogin(prisma: PrismaService, merchantId: string): Promise<boolean> {
  const row = await prisma.waAuthItem.findUnique({ where: { merchantId_key: { merchantId, key: CREDS_KEY } } });
  if (!row) return false;
  try {
    return !!(JSON.parse(row.value, BufferJSON.reviver) as AuthenticationCreds).registered;
  } catch {
    return false;
  }
}
