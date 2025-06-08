const createTransactionDetail = (prisma, data) => {
  return prisma.transaction_details.create({ data });
};

export { createTransactionDetail };
