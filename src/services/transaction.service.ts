import { prisma } from "../lib/prisma";

enum TransactionType {
  SENT = "SENT",
  RECEIVED = "RECEIVED",
  WITHDRAWAL = "WITHDRAWAL",
  DEPOSIT = "DEPOSIT",
}

enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}


async function createTransaction(
  senderUsername: string | null,
  receiverUsername: string | null,
  amount: number,
  transaction_type: TransactionType,
  status : TransactionStatus
) {
  if (amount === null) throw new Error("Amount is required");

  const senderId = senderUsername
    ? (await prisma.wallet.findUnique({ where: { userName: senderUsername } }))?.id
    : null;
  const receiverId = receiverUsername
    ? (await prisma.wallet.findUnique({ where: { userName: receiverUsername } }))?.id
    : null;

  
  return await prisma.transaction.create({
    data: {
      sender_wallet_id: senderId ?? receiverId!,   
      receiver_wallet_id: receiverId ?? senderId!, 
      amount,
      type: transaction_type,
      status,
    },
  });
}


export {
    createTransaction,
    TransactionType,
    TransactionStatus
}
