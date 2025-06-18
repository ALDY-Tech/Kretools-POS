import {apiClient} from "../lib/midtrans.js";
import prisma from "../config/config.js";

export const handleMidtransNotification = async (req, res) => {
  try {
    const statusResponse = await apiClient.transaction.notification(req.body);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        // success
        await prisma.transaction.update({
          where: { id: orderId },
          data: { isPaid: true },
        });
      }
    } else if (transactionStatus === "settlement") {
      // transfer selesai
      await prisma.transaction.update({
        where: { id: orderId },
        data: { isPaid: true },
      });
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      await prisma.transaction.update({
        where: { id: orderId },
        data: { isPaid: false },
      });
    }

    res.status(200).json({ message: "OK" });
  } catch (error) {
    console.error("Midtrans notification error:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
  
