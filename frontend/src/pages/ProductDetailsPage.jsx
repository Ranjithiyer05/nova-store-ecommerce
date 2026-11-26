import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, 
  ArrowLeft, Check, Minus, Plus, Heart, AlertCircle, MessageSquarePlus 
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const isWishlisted = product ? isInWishlist(product._id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        // Call Express REST API: GET http://localhost:5000/api/products/:id
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);

        // Fetch related products in the same category
        if (res.data.product?.category) {
          const relRes = await api.get('/products', {
            params: { category: res.data.product.category },
          });
          setRelatedProducts(
            (relRes.data.products || []).filter((p) => p._id !== id).slice(0, 4)
          );
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Product not found or server is unreachable.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setReviewError('Please write a brief comment.');
      return;
    }
    try {
      setReviewSubmitting(true);
      setReviewError('');
      const res = await api.post(`/products/${id}/reviews`, { rating, comment });
      setReviewSuccess('Thank you! Your review has been recorded.');
      setComment('');
      // Update local product state with new review & recalculated rating
      if (res.data.product) {
        setProduct(res.data.product);
      } else {
        // Fallback refetch
        const refreshed = await api.get(`/products/${id}`);
        setProduct(refreshed.data.product);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium text-sm">Loading product details from MongoDB...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">{error || 'This item does not exist.'}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    if (product.countInStock === 0) return;
    const rect = e?.currentTarget?.getBoundingClientRect();
    const targetX = rect ? rect.left + rect.width / 2 : null;
    const targetY = rect ? rect.top + rect.height / 2 : null;
    addToCart(product, quantity, { targetX, targetY });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600 transition">Products</Link>
          <span>/</span>
          <span className="text-gray-400 capitalize">{product.categoryName || product.category}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous page</span>
        </button>

        {/* Main Product Showcase Grid */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Left Column: Product Image Gallery (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.countInStock === 0 ? (
                    <span className="bg-gray-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-md">
                      Sold Out
                    </span>
                  ) : (
                    <>
                      {product.isBestSeller && (
                        <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                          Bestseller
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                          Save {discountPercent}%
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-md text-gray-400 hover:text-rose-500 hover:bg-white shadow-md transition transform active:scale-90"
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Right Column: Product Information & Purchase (6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Brand & Category */}
                <div className="flex items-center justify-between text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                  <span>{product.brand}</span>
                  <span className="text-gray-400 normal-case font-mono text-[11px]">ID: {product._id}</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="font-bold text-gray-900 text-sm ml-1">{product.rating}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-medium text-blue-600 hover:underline cursor-pointer">
                    {product.numReviews} customer ratings
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 pb-6 border-b border-gray-100">
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed my-6">
                  {product.description}
                </p>

                {/* Stock Status Indicator */}
                <div className="mb-6 flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${product.countInStock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="text-xs font-semibold text-gray-700">
                    {product.countInStock > 0
                      ? `In Stock (${product.countInStock} units left in warehouse)`
                      : 'Currently Out of Stock'}
                  </span>
                </div>

                {/* Quantity Selector and Add to Cart Button */}
                {product.countInStock > 0 && (
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    {/* Quantity Counter */}
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1 w-full sm:w-auto justify-between">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition shadow-xs"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-5 font-bold text-sm text-gray-900">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                        disabled={quantity >= product.countInStock}
                        className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 w-full py-3.5 px-8 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition duration-200 shadow-lg ${
                        isAdded
                          ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25 active:scale-98'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Added to Cart ({quantity})</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Guarantees Box */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
                <div className="p-2">
                  <Truck className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                  <span className="font-semibold block text-gray-700">Free Delivery</span>
                  <span>Orders over $50</span>
                </div>
                <div className="p-2 border-x border-gray-100">
                  <RotateCcw className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                  <span className="font-semibold block text-gray-700">30-Day Returns</span>
                  <span>Hassle-free guarantee</span>
                </div>
                <div className="p-2">
                  <ShieldCheck className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                  <span className="font-semibold block text-gray-700">2-Year Warranty</span>
                  <span>100% Genuine product</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Tabbed Info Section (Overview, Specs, Customer Reviews) */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 mb-16">
          <div className="flex border-b border-gray-100 gap-8 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 text-sm font-bold border-b-2 transition ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Product Overview
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 text-sm font-bold border-b-2 transition ${
                activeTab === 'specs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-bold border-b-2 transition ${
                activeTab === 'reviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Customer Reviews ({product.numReviews})
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed max-w-3xl">
              <p>{product.description}</p>
              <p>
                Every unit undergoes rigorous quality assurance and is backed by manufacturer certification. Designed for discerning enthusiasts who demand uncompromised reliability and sleek aesthetics.
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl text-xs sm:text-sm">
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">Brand</span>
                <span className="font-semibold text-gray-800">{product.brand}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">Category</span>
                <span className="font-semibold text-gray-800">{product.categoryName}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">Stock Availability</span>
                <span className="font-semibold text-gray-800">{product.countInStock} Units</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-500">Warranty</span>
                <span className="font-semibold text-gray-800">24 Months Global</span>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Review Submission Form */}
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-gray-900 text-base mb-2 flex items-center gap-2">
                  <MessageSquarePlus className="w-5 h-5 text-blue-600" />
                  Write a Customer Review
                </h4>
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {reviewSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium">
                        {reviewSuccess}
                      </div>
                    )}
                    {reviewError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                        {reviewError}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Your Rating
                      </label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full sm:w-48 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                        <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                        <option value="3">⭐⭐⭐ (3 - Average)</option>
                        <option value="2">⭐⭐ (2 - Below Average)</option>
                        <option value="1">⭐ (1 - Poor)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Your Review
                      </label>
                      <textarea
                        rows="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this product's performance, durability, and value..."
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {reviewSubmitting ? 'Posting Review...' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <div className="text-xs text-gray-600">
                    Please{' '}
                    <Link to="/login" className="text-blue-600 font-bold hover:underline">
                      Sign in
                    </Link>{' '}
                    to leave a customer rating and review.
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-gray-900">{rev.name}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-amber-400 mb-2">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    No customer reviews yet. Be the first to review this product!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Similar Products You May Like</h3>
              <Link to="/products" className="text-xs font-semibold text-blue-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProductDetailsPage;
