import { Router } from "express";
import { createWallet, depositWallet, withdrawWallet, transferFunds, getWallet } from "../controllers/wallet.controller";

const router = Router();

router.post("/", createWallet);
router.post("/deposit", depositWallet);
router.post("/withdraw", withdrawWallet);
router.post("/transfer", transferFunds);
router.get('/:username', getWallet);

export default router;

