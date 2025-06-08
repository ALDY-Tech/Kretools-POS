import prisma from "../config/config.js";
import { createTransaction } from "../repository/transaction.repository.js";
import { createTransactionDetail } from "../repository/transaction_detail.repository.js";
import { createTransactionAdditional } from "../repository/transaction_additional.repository.js";
import { generateTransactionId } from "../utils/generateTransaction.js";

const createNewTransaction = async (body) => {
  // Accept both camelCase and PascalCase for TransactionDate
  const transactionDateRaw = body.TransactionDate || body.transactionDate;
  if (!transactionDateRaw) {
    throw new Error("TransactionDate is required");
  }

  const date = new Date(transactionDateRaw);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid TransactionDate provided");
  }

  const { CustomerName, items } = body;
  const customTransactionId = await generateTransactionId(prisma, date);

  let totalAmount = 0;
  for (const item of items) {
    const itemSubtotal = item.Qty * item.Harga;
    const addOnsTotal =
      (item.additionals || []).reduce(
        (sum, add) => sum + add.AdditionalPrice,
        0
      ) * item.Qty;

    totalAmount += itemSubtotal + addOnsTotal;
  }

  const transaction = await createTransaction(prisma, {
    id: customTransactionId,
    transactionDate: date,
    customerName: CustomerName,
    totalAmount,
  });

  for (const item of items) {
    const itemTotal =
      item.Qty * item.Harga +
      (item.additionals || []).reduce(
        (sum, add) => sum + add.AdditionalPrice,
        0
      ) *
        item.Qty;

    const detail = await createTransactionDetail(prisma, {
      transactionId: transaction.id,
      itemMasterId: item.ItemMasterID,
      customerName: CustomerName,
      qty: item.Qty,
      totalHarga: itemTotal,
      date,
    });

    for (const add of item.additionals || []) {
      await createTransactionAdditional(prisma, {
        transactionDetailId: detail.id,
        additionalId: add.AdditionalID,
        additionalName: add.AdditionalName,
        additionalPrice: add.AdditionalPrice,
      });
    }
  }

  return {
    message: "Transaction created successfully",
    id: customTransactionId,
  };
};

export { createNewTransaction };
