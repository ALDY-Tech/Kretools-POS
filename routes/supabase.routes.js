import express from "express";
import multer from "multer";
import { handleCreateItem } from "../controller/supabase.controller.js";

const router = express.Router();
const upload = multer(); // pakai memory storage

router.post("/items", upload.single("image"), handleCreateItem);

export default router;
