import { Request, Response } from "express";
import { prisma } from "../lib/prisma"; 
import { createTransaction, TransactionType } from "../services/transaction.service";
import { debitWallet, getWalletValidate, updateWalletBalance, withdrawFundsWallet } from "../services/wallet.service";

async function createWallet(req: Request, res: Response) {
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

async function depositWallet(req: Request, res: Response) {
    console.log(req.body);
    const { username, amount } = req.body;

    if(!username || !amount){
        return res.status(400).json({ error: "Username and amount are required" });
    }

    if (username === "") {
        return res.status(400).json({ error: "Username cannot be empty" });
    }

    
    
    try{
        const wallet = await updateWalletBalance(username, amount);

        console.log("Wallet updated:", username, amount, TransactionType.DEPOSIT);

        await createTransaction(null, username, amount, TransactionType.DEPOSIT);

        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}




async function getWallet(req: Request, res: Response) {
    const { username } = req.params;

    console.log("Get wallet:", username);

    try{
        const wallet = await prisma.wallet.findUnique({
            where: {
                userName: username as string
            }
        });

        if (!wallet) {
            return res.status(404).json({ error: "Wallet not found" });
        }

        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

async function transferFunds(req: Request, res: Response) {
    const { username, amount, userFunded } = req.body;

    const currentAmount = await prisma.wallet.findUnique({
        where: {
            userName: username
        }
    });

    if(!currentAmount){
        return res.status(404).json({ error: "Wallet not found" });
    }

    if(currentAmount.balance < amount){
        return res.status(400).json({ error: "Insufficient funds" });
    }

    if(!userFunded || !amount){
        return res.status(400).json({ error: "User funded and amount are required" });
    }

    const userFundedWallet = await getWalletValidate(userFunded);

    if(!userFundedWallet){
        return res.status(404).json({ error: "User funded not found" });
    }

    try{


        await debitWallet(username, amount);
        await updateWalletBalance(userFunded, amount);


        await createTransaction(username, userFunded, amount, TransactionType.SENT);
        await createTransaction(userFunded, username, amount, TransactionType.RECEIVED);
   
        res.status(200).json({ message: "Transfer successful" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }  
}


async function withdrawWallet(req: Request, res: Response) {
    const { username, amount } = req.body;

    console.log("Withdraw wallet:", username, amount);

    if(!username || !amount){
        return res.status(400).json({ error: "Username and amount are required" });
    }

    if (username === "") {
        return res.status(400).json({ error: "Username cannot be empty" });
    }  
    try{
        const wallet = await withdrawFundsWallet(username, amount);

        console.log("Wallet withdrawn:", username, amount, TransactionType.WITHDRAWAL);

        await createTransaction(username, null, amount, TransactionType.WITHDRAWAL);

        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export {
    createWallet,
    depositWallet,
    getWallet,
    transferFunds,
    withdrawWallet
}