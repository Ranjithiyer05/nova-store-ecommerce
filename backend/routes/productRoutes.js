import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

// Routes for /api/products
router
  .route('/')
  .get(getProducts)       // Read All (with filtering & sorting)
  .post(createProduct);   // Create New Product

// Routes for /api/products/:id
router
  .route('/:id')
  .get(getProductById)    // Read Single Product
  .put(updateProduct)     // Update Product
  .delete(deleteProduct); // Delete Product

export default router;
