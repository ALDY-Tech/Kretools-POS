import express from "express";
import { handleMidtransNotification } from "../controller/midtrans.controller.js";

const router = express.Router();

router.post("/webhook/midtrans", handleMidtransNotification);

export default router;
