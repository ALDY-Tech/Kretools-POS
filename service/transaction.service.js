// service/transaction.service.ts
import prisma from "../config/config.js";
import generateTransactionId from "../utils/generateTransaction.js";

const createNewTransaction = async (body) => {
  const { CustomerName, items } = body;
  if (!CustomerName || !Array.isArray(items) || items.length === 0) {
    throw new Error("CustomerName dan items harus disediakan");
  }

  const date = new Date();
  const customTransactionId = await generateTransactionId(prisma, date);

  let totalAmount = 0;
  const detailCreates = [];

  for (const item of items) {
    if (!item.ItemMasterID || !item.Qty || item.Qty <= 0) {
      throw new Error("ItemMasterID dan Qty harus valid di setiap item");
    }

    const itemMaster = await prisma.itemMaster.findUnique({
      where: { id: item.ItemMasterID },
    });

    if (!itemMaster) {
      throw new Error(`Item dengan ID ${item.ItemMasterID} tidak ditemukan`);
    }

    const itemPrice = itemMaster.price;
    const additionals = [];

    let additionalTotal = 0;
    if (Array.isArray(item.additionals)) {
      for (const add of item.additionals) {
        const additional = await prisma.additional.findUnique({
          where: { id: add.AdditionalID },
        });

        if (!additional) {
          throw new Error(
            `Additional dengan ID ${add.AdditionalID} tidak ditemukan`
          );
        }

        additionals.push({
          additionalId: add.AdditionalID,
        });

        additionalTotal += additional.price;
      }
    }

    const totalHarga = item.Qty * (itemPrice + additionalTotal);
    totalAmount += totalHarga;

    detailCreates.push({
      itemMasterId: item.ItemMasterID,
      customerName: CustomerName,
      qty: item.Qty,
      totalHarga,
      transactionAdditionals: {
        create: additionals,
      },
    });
  }

  const createdTransaction = await prisma.transaction.create({
    data: {
      id: customTransactionId,
      totalAmount,
      transactionDetails: {
        create: detailCreates,
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

  return {
    message: "Transaksi berhasil dibuat",
    data: createdTransaction,
  };
};

export { createNewTransaction };
