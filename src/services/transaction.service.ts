import prisma from "../lib/prisma";

export enum TransactionType {
    SENT = "SENT",
    RECEIVED = "RECEIVED",
    WITHDRAWAL = "WITHDRAWAL",
    DEPOSIT = "DEPOSIT"
}

export async function createTransaction(userFunded: string | null, username: string | null,amount: number | null,transaction_type: TransactionType) {

    await prisma.transaction.create({
        data: {
            sender_wallet_id: username,
            receiver_wallet_id: userFunded,
            amount: amount,
            type: transaction_type
        }
    }); 
    
}   


