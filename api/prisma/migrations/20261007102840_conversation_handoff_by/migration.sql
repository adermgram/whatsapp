-- CreateEnum
CREATE TYPE "HandoffSource" AS ENUM ('AI', 'OWNER');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "handoffBy" "HandoffSource";
