import { apiClient } from "../lib/midtrans.js";
import prisma from "../config/config.js";

export const handleMidtransNotification = async (req, res) => {
  try {
    const rawBody = req.body.toString();
    const notification = JSON.parse(rawBody);

    const { order_id, transaction_status, fraud_status } = notification;

    if (!order_id) {
      console.log("Invalid notification: order_id missing");
      return res.status(400).send("Invalid notification");
    }

    // Temukan transaksi berdasarkan order_id dari Midtrans
    const transaction = await prisma.transaction.findUnique({
      where: { midtransOrderId: order_id },
    });

    if (!transaction) {
      console.log("Transaction not found for order_id:", order_id);
      return res.status(404).send("Transaction not found");
    }

    // Update status transaksi berdasarkan notifikasi Midtrans
    await prisma.transaction.update({
      where: { midtransOrderId: order_id },
      data: {
        status: transaction_status, // contoh: settlement, pending, cancel, etc.
      },
    });

    console.log("Transaction updated:", order_id, transaction_status);

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error in Midtrans webhook:", error);
    res.status(500).send("Internal server error");
  }
};

export const midtransWebhookController = async (req, res) => {
  try {
    const { order_id, transaction_status, fraud_status } = req.body;

    const isSuccess =
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept");

    if (isSuccess) {
      await prisma.transaction.update({
        where: { midtransOrderId: order_id },
        data: { isPaid: true },
      });
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Midtrans webhook error:", error);
    res.status(500).send("Internal Server Error");
  }
};
