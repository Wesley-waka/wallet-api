

import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function createWallet(req: Request, res: Response) {
    const { username } = req.body;
    
    try{
        const wallet = await prisma.wallet.create({
            data: {
                userName: username,
            }
        });

        res.status(201).json(wallet);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
    
}

export async function depositWallet(req: Request, res: Response) {
    const { username, amount } = req.body;

    if(!username || !amount){
        return res.status(400).json({ error: "Username and amount are required" });
    }

    if (username === "") {
        return res.status(400).json({ error: "Username cannot be empty" });
    }

    
    
    try{
        const wallet = await prisma.wallet.update({
            where: {
                userName: username
            },
            data: {
                balance: {
                    increment: amount
                }
            }
        });

        await prisma.transaction.create({
            data: {
                from: null,
                to: username,
                amount: amount,
                type: "deposit"
            }
        });

        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getWallet(req: Request, res: Response) {
    const { username } = req.body;

    try{
        const wallet = await prisma.wallet.findUnique({
            where: {
                userName: username
            }
        });

        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function transferFunds(req: Request, res: Response) {
    const { username, amount, userFunded } = req.body;

    const currentAmount = await prisma.wallet.findUnique({
        where: {
            userName: username
        }
    });

    if(currentAmount.balance < amount){
        return res.status(400).json({ error: "Insufficient funds" });
    }

    if(!userFunded || !amount){
        return res.status(400).json({ error: "User funded and amount are required" });
    }

    const userFundedWallet = await prisma.wallet.findUnique({
        where: {
            userName: userFunded
        }
    });

    if(!userFundedWallet){
        return res.status(404).json({ error: "User funded not found" });
    }

    

    try{

        await prisma.wallet.update({
            where: {
                userName: username
            },
            data: {
                balance: {
                    decrement: amount
                }
            }
        });
        
        await prisma.wallet.update({
            where: {
                userName: userFunded
            },
            data: {
                balance: {
                    increment: amount
                }
            }
        });

        await prisma.transaction.create({
            data: {
                sender_wallet_id: username,
                receiver_wallet_id: userFunded,
                amount: amount,
                type: "SENT"
            }
        });

        // await prisma.transaction.create({
        //     data: {
        //         from: userFunded,
        //         to: username,
        //         amount: amount,
        //         type: "RECEIVED"
        //     }
        // });
        
        res.status(200).json({ message: "Transfer successful" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
    
    
}

export async function getTransactions(req: Request, res: Response) {
    const { username,transactionType } = req.body;

    if(!username){
        return res.status(400).json({ error: "Username is required" });
    }

    if(transactionType && (transactionType !== "SENT" && transactionType !== "RECEIVED" && transactionType !== "DEPOSIT" && transactionType !== "WITHDRAW")){
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

export async function withdrawWallet(req: Request, res: Response) {
    const { username, amount } = req.body;

    if(!username || !amount){
        return res.status(400).json({ error: "Username and amount are required" });
    }

    if (username === "") {
        return res.status(400).json({ error: "Username cannot be empty" });
    }

    
    
    try{
        const wallet = await prisma.wallet.update({
            where: {
                userName: username
            },
            data: {
                balance: {
                    decrement: amount
                }
            }
        });

        await prisma.transaction.create({
            data: {
                sender_wallet_id: username,
                receiver_wallet_id: null,
                amount: amount,
                type: "WITHDRAW"
            }
        });

        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}


