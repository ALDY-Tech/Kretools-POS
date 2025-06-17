import midtransClient from "midtrans-client";
import prisma from "../config/config.js";
import generateTransactionId  from "../utils/generateTransaction.js";

// Konfigurasi Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export const createNewTransaction = async (body) => {
  const { CustomerName, items } = body;
  const transactionDate = new Date();

  const customTransactionId = await generateTransactionId(
    prisma,
    transactionDate
  );
  let totalAmount = 0;

  // Hitung totalAmount
  for (const item of items) {
    const itemData = await prisma.itemMaster.findUnique({
      where: { id: item.ItemMasterID },
    });

    const harga = itemData.price;
    const tambahanHarga = (item.additionals || []).reduce(
      async (sumPromise, add) => {
        const sum = await sumPromise;
        const additional = await prisma.additional.findUnique({
          where: { id: add.AdditionalID },
        });
        return sum + (additional?.price || 0);
      },
      Promise.resolve(0)
    );

    const totalItem = harga * item.Qty + (await tambahanHarga) * item.Qty;
    totalAmount += totalItem;
  }

  // Buat transaksi utama
  const transaction = await prisma.transaction.create({
    data: {
      id: customTransactionId,
      totalAmount,
      transactionDetails: {
        create: await Promise.all(
          items.map(async (item) => {
            const itemData = await prisma.itemMaster.findUnique({
              where: { id: item.ItemMasterID },
            });

            const harga = itemData.price;

            const additionalCreates = await Promise.all(
              (item.additionals || []).map(async (add) => {
                return {
                  additional: { connect: { id: add.AdditionalID } },
                };
              })
            );

            const tambahanHarga = await item.additionals?.reduce(
              async (sumPromise, add) => {
                const sum = await sumPromise;
                const additional = await prisma.additional.findUnique({
                  where: { id: add.AdditionalID },
                });
                return sum + (additional?.price || 0);
              },
              Promise.resolve(0)
            );

            const totalHarga =
              harga * item.Qty + (await tambahanHarga) * item.Qty;

            return {
              itemMasterId: item.ItemMasterID,
              customerName: CustomerName,
              qty: item.Qty,
              totalHarga,
              transactionAdditionals: {
                create: additionalCreates,
              },
            };
          })
        ),
      },
    },
    include: {
      transactionDetails: {
        include: {
          itemMaster: true,
          transactionAdditionals: {
            include: {
              additional: true,
            },
          },
        },
      },
    },
  });

  // Midtrans payload
  const midtransPayload = {
    transaction_details: {
      order_id: customTransactionId,
      gross_amount: totalAmount,
    },
    customer_details: {
      first_name: CustomerName,
    },
    enabled_payments: ["gopay", "bank_transfer", "qris"],
  };

  // Request token dari Midtrans
  const midtransResponse = await snap.createTransaction(midtransPayload);

  return {
    message: "Transaction created successfully",
    transactionId: customTransactionId,
    midtransToken: midtransResponse.token,
    midtransRedirectUrl: midtransResponse.redirect_url,
  };
};
