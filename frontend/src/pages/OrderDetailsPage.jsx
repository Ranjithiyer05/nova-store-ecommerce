import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, Clock, MapPin, CreditCard, 
  Package, ShieldCheck, ArrowLeft, Truck, AlertCircle 
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function OrderDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Could not retrieve order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handlePayOrder = async () => {
    try {
      setActionLoading(true);
      await api.put(`/orders/${id}/pay`, {
        id: `SIM_TXN_${Date.now()}`,
        status: 'COMPLETED',
      });
      await fetchOrder();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment simulation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeliverOrder = async () => {
    try {
      setActionLoading(true);
      await api.put(`/orders/${id}/deliver`);
      await fetchOrder();
    } catch (err) {
      console.error('Delivery update error:', err);
      alert('Failed to update delivery');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium text-sm">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6 text-sm">{error || 'This order could not be located.'}</p>
        <Link to="/orders" className="text-blue-600 font-bold hover:underline">
          Return to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Order Confirmed & Stored in MongoDB</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Order Receipt
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-mono">
              ID: {order._id}
            </p>
          </div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View All My Orders</span>
          </Link>
        </div>

        {/* 2-Column Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Status Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Payment Status Pill */}
              <div className={`p-5 rounded-2xl border flex items-center gap-4 ${
                order.isPaid
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/50 border-amber-200 text-amber-900'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  order.isPaid ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {order.isPaid ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {order.isPaid ? 'Payment Received' : 'Payment Pending'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.isPaid
                      ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                      : 'Awaiting simulated payment confirmation'}
                  </p>
                </div>
              </div>

              {/* Delivery Status Pill */}
              <div className={`p-5 rounded-2xl border flex items-center gap-4 ${
                order.isDelivered
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                  : 'bg-blue-50/50 border-blue-200 text-blue-900'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  order.isDelivered ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {order.isDelivered ? <CheckCircle2 className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {order.isDelivered ? 'Delivered' : 'In Transit / Preparing'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.isDelivered
                      ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                      : 'Dispatched from fulfillment center'}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
                Delivery Address & Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-400 block mb-1">Customer Name</span>
                  <span className="font-bold text-gray-800">{order.user?.name || user?.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Email Address</span>
                  <span className="font-bold text-gray-800">{order.user?.email || user?.email}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-400 block mb-1">Shipping Destination</span>
                  <span className="font-semibold text-gray-800">
                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
                Items in This Order ({order.orderItems.length})
              </h3>
              <div className="divide-y divide-gray-100">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="py-3 flex items-center justify-between gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100"
                      />
                      <div>
                        <Link to={`/product/${item.product}`} className="font-bold text-gray-900 hover:text-blue-600 transition line-clamp-1">
                          {item.name}
                        </Link>
                        <p className="text-gray-400 text-xs">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-800">
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Financial Summary & Actions (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5 sticky top-24">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
              Payment Breakdown
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900">
                  {order.shippingPrice === 0 ? <span className="text-emerald-600 font-bold uppercase">Free</span> : `$${order.shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Tax</span>
                <span className="font-semibold text-gray-900">${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-extrabold text-gray-900">
                <span>Total Paid</span>
                <span className="text-blue-600 text-lg">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Unpaid Order Action */}
            {!order.isPaid && (
              <button
                onClick={handlePayOrder}
                disabled={actionLoading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
              >
                {actionLoading ? 'Processing...' : 'Complete Simulated Payment'}
              </button>
            )}

            {/* Admin Action: Mark as Delivered */}
            {user?.isAdmin && !order.isDelivered && (
              <div className="pt-4 border-t border-gray-100">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-2">
                  Admin Action
                </span>
                <button
                  onClick={handleDeliverOrder}
                  disabled={actionLoading}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>{actionLoading ? 'Updating...' : 'Mark Order as Delivered'}</span>
                </button>
              </div>
            )}

            <div className="pt-2 text-center">
              <p className="text-[11px] text-gray-400">Payment: {order.paymentMethod}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default OrderDetailsPage;
