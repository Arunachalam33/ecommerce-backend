import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
} from "../controller/productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);

export default router;