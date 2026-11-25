import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const isWishlisted = isInWishlist(product._id);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.countInStock === 0) return;
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(59,130,246,0.2), 0 20px 40px rgba(0,0,0,0.4)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <Link to={`/product/${product._id}`} className="relative block aspect-square overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.countInStock === 0 ? (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', color: 'rgba(240,246,255,0.7)' }}>
              Out of Stock
            </span>
          ) : (
            <>
              {product.isBestSeller && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md text-white" style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
                  Bestseller
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md text-white" style={{ background: 'linear-gradient(135deg, #EF4444, #F97316)' }}>
                  -{discountPercent}%
                </span>
              )}
            </>
          )}
        </div>

        <button
          onClick={handleToggleWishlist}
          aria-label="Save to Wishlist"
          className="absolute top-3 right-3 p-2 rounded-full transition transform active:scale-90"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400 text-rose-400' : 'text-white/60 hover:text-rose-400'}`} />
        </button>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: 'rgba(240,246,255,0.4)' }}>
          <span>{product.categoryName || product.category}</span>
          <span className="font-semibold" style={{ color: 'rgba(240,246,255,0.6)' }}>{product.brand}</span>
        </div>

        <Link to={`/product/${product._id}`} className="font-semibold text-sm text-white hover:text-blue-400 transition line-clamp-2 leading-snug mb-2">
          {product.name}
        </Link>

        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-white/15'}`} />
            ))}
          </div>
          <span className="text-[11px]" style={{ color: 'rgba(240,246,255,0.4)' }}>({product.numReviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-black gradient-text">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs line-through ml-1.5" style={{ color: 'rgba(240,246,255,0.3)' }}>${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="p-2.5 rounded-xl transition-all duration-200 disabled:opacity-30"
            style={isAdded
              ? { background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)' }
              : { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }
            }
          >
            {isAdded
              ? <Check className="w-4 h-4 text-emerald-400" />
              : <ShoppingCart className="w-4 h-4 text-blue-400" />
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
