const generateTransactionId = async (prisma, date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date provided to generateTransactionId");
  }

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");

  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

  const count = await prisma.transaction.count({
    where: {
      transactionDate: {
        gte: start,
        lte: end,
      },
    },
  });

  const serial = String(count + 1).padStart(6, "0");
  return `${year}${month}${serial}`;
};

export { generateTransactionId };
