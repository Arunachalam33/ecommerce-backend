import express from "express";
import authenticate from "../middleware/authenticate.js";
import isAdmin from "../middleware/admin.js";
import { createProduct } from "../controller/productController.js";
import { getAllOrders, markShipped } from "../controller/orderController.js";
import {  deleteProduct } from "../controller/productController.js";

const router = express.Router();

router.use(authenticate, isAdmin);

router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/ship", markShipped);





export default router;
