import {
  addAdditionalController,
  getAllAdditionalsController,
  getAdditionalByIdController,
  updateAdditionalController,
  deleteAdditionalController,
} from "../controller/additional.controller.js";
import express from "express";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/additional", verifyAdmin, addAdditionalController);
router.get("/additional", getAllAdditionalsController);
router.get("/additional/:id", getAdditionalByIdController);
router.put("/additional/:id", verifyAdmin, updateAdditionalController);
router.delete("/additional/:id", verifyAdmin, deleteAdditionalController);

export default router;