import express from "express";
import { protect, admin } from "../middleware/auth.js";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
} from "../controllers/orderController.js";

const router = express.Router();

router.use(protect);

router.post("/", createOrder);
router.get("/mine", getMyOrders);
router.get("/:id", getOrderById);

// Admin
router.get("/", admin, getAllOrders);
router.put("/:id/status", admin, updateOrderStatus);

export default router;
