import express from "express";
import { addItemController, getAllItemsController, getItemByIdController,updateItemController, deleteItemController } from "../controller/ItemMaster.controller.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/item", verifyAdmin, addItemController);
router.get("/item", getAllItemsController);
router.get("/item/:id", getItemByIdController);
router.patch("/item/:id", verifyAdmin, updateItemController);
router.delete("/item/:id", verifyAdmin, deleteItemController);

export default router;
