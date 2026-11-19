import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getAdminStats,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User Order Creation & Admin Get All Orders
router
  .route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

// Admin Analytics Statistics
router.route('/stats').get(protect, admin, getAdminStats);

// User Personal Order History
router.route('/myorders').get(protect, getMyOrders);

// Single Order Detail
router.route('/:id').get(protect, getOrderById);

// Simulated Payment Route
router.route('/:id/pay').put(protect, updateOrderToPaid);

// Admin Delivery Update Route
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;
