import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CableAnimation from './components/CableAnimation';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-clip font-sans bg-[#F5F3EE] dark:bg-[#0B0B0C] text-[#0B0B0C] dark:text-[#F5F3EE] transition-colors duration-300">
      <Navbar />
      <CableAnimation />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/categories" element={<ProductsPage />} />
          <Route path="/category/:categorySlug" element={<ProductsPage />} />
          <Route path="/deals" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:id" element={<OrderDetailsPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={
            <div className="py-24 text-center">
              <h1 className="text-4xl font-extrabold text-white mb-2">404</h1>
              <p style={{ color: 'rgba(240,246,255,0.5)' }} className="mb-6">Page not found.</p>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
