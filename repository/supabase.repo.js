import supabase from "../config/supabase.js";
import { v4 as uuidv4 } from "uuid";

export async function uploadImageToSupabase(file) {
  const buffer = file.buffer;
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(fileName, buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
