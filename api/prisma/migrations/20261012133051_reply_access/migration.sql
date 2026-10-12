-- CreateEnum
CREATE TYPE "ReplyMode" AS ENUM ('ALLOWLIST', 'EVERYONE');

-- AlterTable
ALTER TABLE "Merchant" ADD COLUMN     "accessImportedAt" TIMESTAMP(3),
ADD COLUMN     "replyMode" "ReplyMode" NOT NULL DEFAULT 'ALLOWLIST';

-- CreateTable
CREATE TABLE "AllowedNumber" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllowedNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IgnoredNumber" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "pushName" TEXT,
    "count" INTEGER NOT NULL DEFAULT 1,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IgnoredNumber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AllowedNumber_merchantId_phone_key" ON "AllowedNumber"("merchantId", "phone");

-- CreateIndex
CREATE INDEX "IgnoredNumber_merchantId_lastSeenAt_idx" ON "IgnoredNumber"("merchantId", "lastSeenAt");

-- CreateIndex
CREATE UNIQUE INDEX "IgnoredNumber_merchantId_phone_key" ON "IgnoredNumber"("merchantId", "phone");

-- AddForeignKey
ALTER TABLE "AllowedNumber" ADD CONSTRAINT "AllowedNumber_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IgnoredNumber" ADD CONSTRAINT "IgnoredNumber_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
