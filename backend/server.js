import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// 1. Enable CORS so React frontend (port 5173) can communicate with backend
app.use(cors());

// 2. Built-in middleware to parse incoming JSON payloads in request body
app.use(express.json());

// 3. Mount Application Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// 4. Health & Root API Endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'NovaStore MERN Backend API is running successfully! 🚀',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(1)}s`,
  });
});

// 5. Global 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Not Found - ${req.originalUrl}` });
});

// 6. Start the Express server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`📦 Products Endpoint: http://localhost:${PORT}/api/products`);
  console.log(`👤 Users Endpoint: http://localhost:${PORT}/api/users`);
  console.log(`🛍️ Orders Endpoint: http://localhost:${PORT}/api/orders`);
});
