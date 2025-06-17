// service/payment.service.js
import snap from "../lib/midtrans.js";

const createMidtransTransaction = async (transactionData) => {
  const parameter = {
    transaction_details: {
      order_id: transactionData.id, // Contoh: '2506000005'
      gross_amount: transactionData.totalAmount, // jumlah total
    },
    customer_details: {
      first_name: transactionData.customerName,
    },
    item_details: transactionData.items.map((item, index) => ({
      id: `${item.ItemMasterID}-${index}`,
      price: item.Harga,
      quantity: item.Qty,
      name: item.ItemName,
    })),
  };

  const midtransResponse = await snap.createTransaction(parameter);
  return midtransResponse;
};

export { createMidtransTransaction };