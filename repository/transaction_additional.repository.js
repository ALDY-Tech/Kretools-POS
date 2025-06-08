const createTransactionAdditional = (prisma, data) => {
  return prisma.transaction_additional.create({ data });
};

export { createTransactionAdditional };
