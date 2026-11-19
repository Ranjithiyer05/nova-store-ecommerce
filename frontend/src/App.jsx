import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* 2. Client-Side Page Routes */}
      <main className="flex-1">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<HomePage />} />
          
          {/* Products Catalog Route */}
          <Route path="/products" element={<ProductsPage />} />
          
          {/* Dynamic Product Details Route */}
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          
          {/* Category Shortcut Route */}
          <Route path="/categories" element={<ProductsPage />} />
          <Route path="/category/:categorySlug" element={<ProductsPage />} />
          
          {/* Deals Route */}
          <Route path="/deals" element={<ProductsPage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Shopping Cart & Checkout Routes */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:id" element={<OrderDetailsPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />

          {/* Admin Dashboard Route */}
          <Route path="/admin" element={<AdminDashboardPage />} />

          {/* 404 Fallback Route */}
          <Route
            path="*"
            element={
              <div className="py-24 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404</h1>
                <p className="text-gray-500 mb-6">Page not found.</p>
              </div>
            }
          />
        </Routes>
      </main>

      {/* 3. Global Footer */}
      <Footer />
    </div>
  );
}

export default App;
