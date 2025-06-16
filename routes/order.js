import express from "express";
import { placeOrder } from "../controller/orderController.js";
import { getUserOrders } from "../controller/orderController.js";
import authMiddleware from "../middleware/authenticate.js";

const router = express.Router();

router.post("/", authMiddleware, placeOrder);
router.get("/", authMiddleware, getUserOrders);

export default router;