import {
  insertAdditional,
  getAllAdditionals,
  getAdditionalById,
  updateAdditional,
  deleteAdditional,
} from "../repository/additional.repository.js";

const createAdditional = async (additional) => {
  if (!additional.additionalItem || !additional.price || !additional.itemCategory) {
    throw new Error("Semua field harus diisi");
  }

  const newAdditional = await insertAdditional(additional);
  return newAdditional;
}

const getAllAdditionalsService = async () => {
  const additionals = await getAllAdditionals();
  return additionals;
};

const getAdditionalByIdService = async (id) => {
  const additional = await getAdditionalById(id);
  return additional;
};

const updateAdditionalService = async (id, additional) => {
  const updatedAdditional = await updateAdditional(id, additional);
  return updatedAdditional;
};

const deleteAdditionalService = async (id) => {
  const deletedAdditional = await deleteAdditional(id);
  return deletedAdditional;
};

export { createAdditional, getAllAdditionalsService, getAdditionalByIdService, updateAdditionalService, deleteAdditionalService };