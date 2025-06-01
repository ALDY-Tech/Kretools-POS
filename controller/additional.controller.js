import {
  createAdditional,
  getAllAdditionalsService,
  updateAdditionalService,
  deleteAdditionalService,
} from "../usecase/additional.service.js";

const addAdditionalController = async (req, res) => {
  try {
    const newAdditional = await createAdditional(req.body);
    res.status(201).json(newAdditional);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Gagal menambahkan additional", error: err.message });
  }
}

const getAllAdditionalsController = async (req, res) => {
  try {
    const additionals = await getAllAdditionalsService();
    res.status(200).json(additionals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Gagal mendapatkan daftar additional", error: err.message });
  }
};

const updateAdditionalController = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedAdditional = await updateAdditionalService(parseInt(id), req.body);
    res.status(200).json({ msg: "Additional berhasil diperbarui", additional: updatedAdditional });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Gagal memperbarui additional", error: err.message });
  }
}

const deleteAdditionalController = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedAdditional = await deleteAdditionalService(parseInt(id));
        res.status(200).json({
        msg: "Additional berhasil dihapus",
        additional: deletedAdditional,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Gagal menghapus additional", error: err.message });
    }
}

export {
  addAdditionalController,
  getAllAdditionalsController,
  updateAdditionalController,
  deleteAdditionalController,
};