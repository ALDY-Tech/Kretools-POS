import express from "express";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/ItemMaster.routes.js";
import additionalRoutes from "./routes/additional.routes.js";
import { verifyToken } from "./middleware/auth.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // sesuaikan dengan frontend kamu
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.get("/validate", verifyToken, (req, res) => {
  return res.status(200).json({ status: "valid" });
});

app.post("/api/transactions", async (req, res) => {
  const { TransactionDate, CustomerName, items } = req.body;

  try {
    let totalAmount = 0;

    // Hitung total dulu
    for (const item of items) {
      const itemTotal = item.Qty * item.Harga;
      const additionalTotal =
        item.additionals.reduce((sum, a) => sum + a.AdditionalPrice, 0) *
        item.Qty;
      totalAmount += itemTotal + additionalTotal;
    }

    // Simpan ke Transaction
    const transaction = await prisma.transaction.create({
      data: {
        transactionDate: new Date(TransactionDate),
        customerName: CustomerName,
        totalAmount: totalAmount,
      },
    });

    // Simpan detail + tambahan
    for (const item of items) {
      const detail = await prisma.transaction_details.create({
        data: {
          transactionId: transaction.Transaction_id,
          itemMasterId: item.ItemMasterID,
          itemCode: item.ItemCode,
          itemName: item.ItemName,
          customerName: CustomerName,
          qty: item.Qty,
          harga: item.Harga,
          totalHarga:
            item.Qty * item.Harga +
            item.additionals.reduce((sum, a) => sum + a.AdditionalPrice, 0) *
              item.Qty,
          date: new Date(TransactionDate),
        },
      });

      for (const add of item.additionals) {
        await prisma.transaction_additional.create({
          data: {
            transactionDetailId: detail.id,
            additionalId: add.AdditionalID,
            additionalName: add.AdditionalName,
            additionalPrice: add.AdditionalPrice,
          },
        });
      }
    }

    res.status(201).json({
      message: "Transaction saved",
      transactionId: transaction.Transaction_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save transaction", error });
  }
});

app.use("/", authRoutes);
app.use("/api", itemRoutes, additionalRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
// export default app;
