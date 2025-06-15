import { createNewTransaction } from "../service/transaction.service.js";

const createTransactionController = async (req, res) => {
  try {
    const transaction = await createNewTransaction(req.body);
    return res.status(201).json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({ error: error.message });
  }
};

export { createTransactionController };