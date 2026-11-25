import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

function WishlistPage() {
  const { wishlistItems } = useCart();

  return (
    <div className="min-h-screen bg-[#F5F3EE] dark:bg-[#0B0B0C] text-[#0B0B0C] dark:text-[#F5F3EE] py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 pb-6 border-b border-[#0B0B0C]/10 dark:border-[#F5F3EE]/10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EAE5DC] dark:bg-[#141416] border border-[#0B0B0C]/10 dark:border-[#F5F3EE]/10 flex items-center justify-center text-[#8C6D46] dark:text-[#C8A97E]">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="font-serif-editorial text-3xl sm:text-4xl font-normal tracking-tight">
                Saved Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-[#0B0B0C]/55 dark:text-[#F5F3EE]/55 mt-0.5">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'object' : 'objects'} curated for later
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {wishlistItems.length === 0 ? (
          <div className="bg-[#EAE5DC]/60 dark:bg-[#141416] rounded-3xl border border-[#0B0B0C]/10 dark:border-[#F5F3EE]/10 p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#F5F3EE] dark:bg-[#1B1B1E] text-[#8C6D46] dark:text-[#C8A97E] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="font-serif-editorial text-2xl mb-2">Your wishlist is empty</h3>
            <p className="text-xs sm:text-sm text-[#0B0B0C]/60 dark:text-[#F5F3EE]/55 mb-6">
              Tap the heart icon on any object to save it to your personal collection.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#0B0B0C] dark:bg-[#F5F3EE] text-[#F5F3EE] dark:text-[#0B0B0C] px-7 py-3 rounded-full font-semibold text-xs uppercase tracking-[0.15em] hover:bg-[#8C6D46] dark:hover:bg-[#C8A97E] transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
