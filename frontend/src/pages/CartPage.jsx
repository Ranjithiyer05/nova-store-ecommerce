import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Trash2, Minus, Plus, ArrowRight, 
  ShieldCheck, ArrowLeft, Truck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function CartPage() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    itemsPrice, 
    shippingPrice, 
    taxPrice, 
    totalPrice 
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: '/checkout' } });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 px-4 bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Looks like you haven't added anything to your cart yet. Explore our top tech gadgets and audio gear!
          </p>
          <Link
            to="/products"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition"
          >
            <span>Start Shopping Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              You have <strong className="text-gray-900">{cartItems.length}</strong> unique item(s) in your basket.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition self-start sm:self-auto"
          >
            Clear Entire Cart
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:shadow-md transition"
              >
                {/* Thumbnail */}
                <Link
                  to={`/product/${item._id}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <Link
                    to={`/product/${item._id}`}
                    className="block text-sm sm:text-base font-bold text-gray-900 hover:text-blue-600 transition line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-gray-400">
                    Unit Price: <span className="text-gray-700 font-semibold">${item.price.toFixed(2)}</span>
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition shadow-xs"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={item.quantity >= item.countInStock}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition shadow-xs"
                    title="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Subtotal for Item */}
                <div className="text-right sm:min-w-[5rem]">
                  <span className="block text-base font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Remove Trash Button */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Continue Shopping Link */}
            <div className="pt-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-blue-600 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary Card (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100">
              Order Summary
            </h2>

            {/* Free Shipping Tracker */}
            <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-blue-900">
              <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
              {itemsPrice >= 50 ? (
                <span className="font-semibold text-emerald-700">
                  🎉 Congratulations! You unlocked Free Express Shipping!
                </span>
              ) : (
                <span>
                  Add <strong>${(50 - itemsPrice).toFixed(2)}</strong> more to get <strong>Free Shipping</strong>!
                </span>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900">
                  {shippingPrice === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase">Free</span>
                  ) : (
                    `$${shippingPrice.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-gray-900">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-extrabold text-gray-900">
                <span>Total Amount</span>
                <span className="text-blue-600 text-lg">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition duration-200 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{user ? 'Proceed to Checkout' : 'Sign in to Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Guarantee */}
            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe & Secure 256-Bit SSL Checkout</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default CartPage;
