import {
  createItem,
  getAllItemsService,
  updateItemService, 
  deleteItemService,
} from "../service/ItemMaster.service.js";

const addItemController = async (req, res) => {
  try {
    const newItem = await createItem(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Gagal menambahkan item", error: err.message });
  }
};

const getAllItemsController = async (req, res) => {
  try {
    const items = await getAllItemsService();
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ msg: "Gagal mendapatkan daftar item", error: err.message });
  }
};

const updateItemController = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedItem = await updateItemService(parseInt(id), req.body);
    res.status(200).json({ msg: "Item berhasil diperbarui", item: updatedItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Gagal memperbarui item", error: err.message });
  }
}

const deleteItemController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await deleteItemService(parseInt(id));
    res.status(200).json({
      msg: "Item berhasil dihapus",
      item: deletedItem,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Gagal menghapus item", error: err.message });
  }
};

export { addItemController, getAllItemsController, updateItemController, deleteItemController };
