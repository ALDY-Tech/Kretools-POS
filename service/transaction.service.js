import {snap} from "../lib/midtrans.js";
import prisma from "../config/config.js";
import {generateTransactionId, generateOrderId}  from "../utils/generateTransaction.js";

// Konfigurasi Midtrans Snap

export const createNewTransaction = async (body) => {
  const date = new Date();
  const transactionId = await generateTransactionId(prisma, date);
  const orderId = generateOrderId(transactionId);

  let totalAmount = 0;

  const transactionDetailsData = await Promise.all(
    body.items.map(async (item) => {
      const itemMaster = await prisma.itemMaster.findUnique({
        where: { id: item.ItemMasterID },
      });
      if (!itemMaster)
        throw new Error(`ItemMaster ${item.ItemMasterID} not found`);
      let harga = item.Harga || itemMaster.price;
      let additionalsTotal = 0;

      const additionalsData = await Promise.all(
        item.additionals.map(async (add) => {
          const additional = await prisma.additional.findUnique({
            where: { id: add.AdditionalID },
          });
          if (!additional)
            throw new Error(`Additional ${add.AdditionalID} not found`);
          additionalsTotal += additional.price;
          return { additionalId: add.AdditionalID };
        })
      );

      const totalHarga = (harga + additionalsTotal) * item.Qty;
      totalAmount += totalHarga;

      return {
        itemMasterId: item.ItemMasterID,
        customerName: body.CustomerName,
        qty: item.Qty,
        totalHarga,
        transactionAdditionals: {
          create: additionalsData,
        },
      };
    })
  );

  const transaction = await prisma.transaction.create({
    data: {
      id: transactionId,
      midtransOrderId: orderId,
      totalAmount,
      transactionDetails: {
        create: transactionDetailsData,
      },
    },
    include: {
      transactionDetails: {
        include: {
          transactionAdditionals: true,
          itemMaster: true,
        },
      },
    },
  });

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: totalAmount,
    },
    customer_details: {
      first_name: body.CustomerName,
    },
  };

  const snapResponse = await snap.createTransaction(parameter);

  return {
    transaction,
    snapToken: snapResponse.token,
    redirectUrl: snapResponse.redirect_url,
  };
};
