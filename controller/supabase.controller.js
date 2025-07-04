import { createItem } from "../service/Supabase.service.js";

export async function handleCreateItem(req, res) {
  try {
    const itemData = req.body;
    const file = req.file;

    const item = await createItem(itemData, file);
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
