import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const isWishlisted = isInWishlist(product._id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#141416] border border-[#F5F3EE]/10 hover:border-[#C8A97E]/40 transition-all duration-500 hover:-translate-y-1.5">
      {/* Image Frame */}
      <Link to={`/product/${product._id}`} className="relative block aspect-square overflow-hidden bg-[#1B1B1E]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Editorial Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.countInStock === 0 ? (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0B0B0C]/80 backdrop-blur-md text-[#F5F3EE]/70">
              Sold Out
            </span>
          ) : (
            <>
              {product.isBestSeller && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#C8A97E] text-[#0B0B0C]">
                  Bestseller
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F5F3EE] text-[#0B0B0C]">
                  -{discountPercent}%
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Save to Wishlist"
          className="absolute top-3 right-3 p-2.5 rounded-full bg-[#0B0B0C]/65 backdrop-blur-md border border-[#F5F3EE]/10 transition transform active:scale-90 hover:border-[#C8A97E]/50"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400 text-rose-400' : 'text-[#F5F3EE]/70 hover:text-rose-400'}`} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#F5F3EE]/45 mb-1.5">
          <span>{product.categoryName || product.category}</span>
          <span className="font-medium text-[#C8A97E]">{product.brand}</span>
        </div>

        <Link to={`/product/${product._id}`} className="font-medium text-sm text-[#F5F3EE] hover:text-[#C8A97E] transition line-clamp-2 leading-snug mb-2">
          {product.name}
        </Link>

        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating) ? 'fill-[#C8A97E] text-[#C8A97E]' : 'text-[#F5F3EE]/15'}`} />
            ))}
          </div>
          <span className="text-[11px] text-[#F5F3EE]/40">({product.numReviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-[#F5F3EE]/10">
          <div>
            <span className="font-serif-editorial text-xl text-[#F5F3EE]">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs line-through ml-2 text-[#F5F3EE]/35">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className={`p-2.5 rounded-full transition-all duration-300 disabled:opacity-30 ${
              isAdded
                ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-400'
                : 'bg-[#F5F3EE]/10 border border-[#F5F3EE]/15 text-[#F5F3EE] hover:bg-[#C8A97E] hover:text-[#0B0B0C] hover:border-[#C8A97E]'
            }`}
          >
            {isAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
