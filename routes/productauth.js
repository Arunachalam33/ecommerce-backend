import express from "express";
import isAdmin from "../middleware/admin.js";
import {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct
} from "../controller/productController.js";
import authMiddleware from "../middleware/authenticate.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, isAdmin, createProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);


export default router;