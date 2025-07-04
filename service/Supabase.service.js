import { uploadImageToSupabase } from "../repository/supabase.repo.js";

export async function createItem(itemData, file) {
  const imageUrl = await uploadImageToSupabase(file);

  return {
    itemName: itemData.itemName,
    price: itemData.price,
    imageUrl,
  };
}
