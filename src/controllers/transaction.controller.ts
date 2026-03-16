
import { prisma } from "../lib/prisma"; 
import { Request, Response } from "express";

async function getTransactions(req: Request, res: Response) {
    const { username,transactionType } = req.body;

    if(!username){
        return res.status(400).json({ error: "Username is required" });
    }

    if(transactionType && (transactionType !== "SENT" && transactionType !== "RECEIVED" && transactionType !== "DEPOSIT" && transactionType !== "WITHDRAWAL")){
        return res.status(400).json({ error: "Transaction type must be SENT, RECEIVED, DEPOSIT or WITHDRAW" });
    }

    try{
       const transactions = await prisma.transaction.findMany({
            where: {
                type: transactionType || undefined,
                OR: [
                { sender_wallet: { userName: username } },
                { receiver_wallet: { userName: username } }
                ]
            }
            });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export {
    getTransactions
}