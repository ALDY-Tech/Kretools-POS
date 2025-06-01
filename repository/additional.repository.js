import prisma from "../config/config.js";
const db = prisma;

const insertAdditional = async (additional) => {
  const newAdditional = await db.additional.create({
    data: {
      additionalItem: additional.additionalItem,
      price: additional.price,
      is_required: additional.required,
      itemCategory: additional.itemCategory,
    },
  });
  return newAdditional;
}

const getAllAdditionals = async () => {
  const additionals = await db.additional.findMany();
  return additionals;
};

const updateAdditional = async (id, additional) => {
  const updatedAdditional = await db.additional.update({
    where: { id: id },
    data: {
      additionalItem: additional.additionalItem,
      price: additional.price,
      is_required: additional.required,
      itemCategory: additional.itemCategory,
    },
  });
  return updatedAdditional;
};

const deleteAdditional = async (id) => {
  const deletedAdditional = await db.additional.delete({
    where: { id: id },
  });
  return deletedAdditional;
};

export {
  insertAdditional,
  getAllAdditionals,
  updateAdditional,
  deleteAdditional
};