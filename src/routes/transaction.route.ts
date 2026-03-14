import { Router } from "express";
import { getTransactions } from "../controllers/transaction.controller";

const router = Router();

router.post("/", getTransactions);

export default router;