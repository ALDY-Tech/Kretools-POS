const createTransaction = (prisma, data) => {
  return prisma.transaction.create({ data });
};

export { createTransaction };
