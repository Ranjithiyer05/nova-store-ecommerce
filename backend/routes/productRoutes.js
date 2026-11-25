import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for /api/products
router
  .route('/')
  .get(getProducts)               // Read All (with filtering & sorting)
  .post(protect, admin, createProduct); // Create New Product (Admin only)

// Routes for /api/products/:id/reviews
router
  .route('/:id/reviews')
  .post(protect, createProductReview); // Customer review (Protected)

// Routes for /api/products/:id
router
  .route('/:id')
  .get(getProductById)            // Read Single Product
  .put(protect, admin, updateProduct)   // Update Product (Admin only)
  .delete(protect, admin, deleteProduct); // Delete Product (Admin only)

export default router;
