import express from "express";
import { handleMidtransNotification } from "../controller/midtrans.controller.js";

const router = express.Router();

router.post("/midtrans/notification", handleMidtransNotification);

export default router;
