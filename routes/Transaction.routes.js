import { createTransactionController } from "../controller/transaction.controller.js";

import express from "express";

const router = express.Router();
router.post("/transaction", createTransactionController);

export default router;