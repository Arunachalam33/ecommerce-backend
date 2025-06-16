import express from "express";
import { placeOrder } from "../controller/orderController.js";
import { getUserOrders } from "../controller/orderController.js";
import authenticate from "../middleware/authenticate.js"; // token middleware

const router = express.Router();

router.post("/orders", authenticate, placeOrder);
router.get("/orders", authenticate, getUserOrders);

export default router;