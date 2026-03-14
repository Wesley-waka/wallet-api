import { Router } from "express";
import { createWallet, getTransactions, depositWallet, withdrawWallet, transferFunds, getWallet } from "../controllers/wallet.controller";

const router = Router();

router.post("/", createWallet);
router.post("/transactions", getTransactions);
router.post("/deposit", depositWallet);
router.post("/withdraw", withdrawWallet);
router.post("/transfer", transferFunds);
router.get('/', getWallet);

export default router;

