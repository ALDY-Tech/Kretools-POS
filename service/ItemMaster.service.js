import { generateItemCode } from "../utils/Itemcode.js";
import {
  insertItem,
  countItemsByCategory,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} from "../repository/itemMaster.repository.js";

const createItem = async ({ itemName, category, price, uom, status }) => {
  const count = await countItemsByCategory(category);
  const itemCode = generateItemCode(category, count);

  if (!itemName || !category || !price || !uom || !status) {
    throw new Error("Semua field harus diisi");
  }

  const newItem = await insertItem({
    itemCode,
    itemName,
    category,
    price,
    uom,
    status,
  });

  return newItem;
};

const getAllItemsService = async () => {
  const items = await getAllItems();
  return items;
};

const getItemByIdService = async (id) => {
  const item = await getItemById(id);
  return item;
};

const updateItemService = async (id, item) => {
  const count = await countItemsByCategory(item.category);
  const itemCode = generateItemCode(item.category, count);

  const updatedItems = await updateItem(id, {
    itemCode,
    itemName: item.itemName,
    category: item.category,
    price: item.price,
    uom: item.uom,
    status: item.status,
  });

  return updatedItems;
};

const deleteItemService = async (id) => {
  if (!id) {
    throw new Error("ID item harus disediakan");
  }
  const deletedItem = await deleteItem(id);
  return deletedItem;
};

export { createItem, getAllItemsService, getItemByIdService, updateItemService, deleteItemService };
