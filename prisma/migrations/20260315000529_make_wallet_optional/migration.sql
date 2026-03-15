/*
  Warnings:

  - Changed the type of `type` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_receiver_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_sender_wallet_id_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "sender_wallet_id" DROP NOT NULL,
ALTER COLUMN "receiver_wallet_id" DROP NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "TransactionType";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sender_wallet_id_fkey" FOREIGN KEY ("sender_wallet_id") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receiver_wallet_id_fkey" FOREIGN KEY ("receiver_wallet_id") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
