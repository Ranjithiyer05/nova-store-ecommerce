import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles, AlertCircle } from 'lucide-react';
import api from '../services/api';
import ProductCard from './ProductCard';

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/products');
        setProducts(response.data.products || []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Unable to load live products from server. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (activeTab === 'featured') return product.isFeatured;
    if (activeTab === 'bestseller') return product.isBestSeller;
    return true;
  });

  return (
    <section className="py-20 bg-[#EAE5DC] dark:bg-[#0B0B0C] text-[#0B0B0C] dark:text-[#F5F3EE] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header & Tab Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 pb-6 border-b border-[#0B0B0C]/10 dark:border-[#F5F3EE]/10">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8C6D46] dark:text-[#C8A97E] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Exhibition / Live Catalog</span>
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-normal tracking-tight mt-2 text-[#0B0B0C] dark:text-[#F5F3EE]">
              Trending & Best Sellers
            </h2>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-2 p-1 rounded-full bg-[#F5F3EE] dark:bg-[#141416] border border-[#0B0B0C]/10 dark:border-[#F5F3EE]/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                activeTab === 'all'
                  ? 'bg-[#0B0B0C] dark:bg-[#F5F3EE] text-[#F5F3EE] dark:text-[#0B0B0C]'
                  : 'text-[#0B0B0C]/60 dark:text-[#F5F3EE]/60 hover:text-[#0B0B0C] dark:hover:text-[#F5F3EE]'
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'featured'
                  ? 'bg-[#0B0B0C] dark:bg-[#F5F3EE] text-[#F5F3EE] dark:text-[#0B0B0C]'
                  : 'text-[#0B0B0C]/60 dark:text-[#F5F3EE]/60 hover:text-[#0B0B0C] dark:hover:text-[#F5F3EE]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured</span>
            </button>
            <button
              onClick={() => setActiveTab('bestseller')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'bestseller'
                  ? 'bg-[#0B0B0C] dark:bg-[#F5F3EE] text-[#F5F3EE] dark:text-[#0B0B0C]'
                  : 'text-[#0B0B0C]/60 dark:text-[#F5F3EE]/60 hover:text-[#0B0B0C] dark:hover:text-[#F5F3EE]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Best Sellers</span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm mb-8">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#141416] border border-[#F5F3EE]/10 p-4 animate-pulse">
                <div className="aspect-square rounded-xl bg-[#1F1F23] mb-4" />
                <div className="h-4 bg-[#1F1F23] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#1F1F23] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[#F5F3EE]/20 text-xs font-semibold uppercase tracking-[0.15em] text-[#F5F3EE] hover:bg-[#F5F3EE] hover:text-[#0B0B0C] transition-all duration-300"
          >
            <span>Explore All Catalog Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
