import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RotateCcw, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { categories } from '../data/categoriesData';
import ProductCard from '../components/ProductCard';

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch products from backend whenever search, category or sort changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query string params
        const params = {};
        if (searchTerm.trim()) params.keyword = searchTerm.trim();
        if (selectedCategory !== 'all') params.category = selectedCategory;
        if (sortBy !== 'featured') params.sort = sortBy;

        // Call Express API: GET http://localhost:5000/api/products?keyword=...&category=...
        const response = await api.get('/products', { params });
        setProducts(response.data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products from server. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search input slightly to avoid firing on every keystroke
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory, sortBy]);

  // Client-side price & stock filters
  const displayedProducts = products.filter((product) => {
    const matchesPrice = product.price <= maxPrice;
    const matchesStock = !inStockOnly || product.countInStock > 0;
    return matchesPrice && matchesStock;
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('featured');
    setMaxPrice(2000);
    setInStockOnly(false);
    setSearchParams({});
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white mb-8 shadow-xl shadow-blue-900/10 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              Explore Our Live Catalog
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              All Products & Tech Gadgets
            </h1>
            <p className="text-blue-100 text-sm sm:text-base mt-2 leading-relaxed">
              Find premium wireless audio, smart wearables, laptops, and lifestyle accessories powered by MongoDB.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
        </div>

        {/* Search & Action Bar */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Live Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, brand, or specs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          {/* Mobile Filter Toggle & Sort Dropdown */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-gray-50"
            >
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <span className="hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-gray-800 focus:outline-none focus:border-blue-500"
              >
                <option value="featured">Featured First</option>
                <option value="bestseller">Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-center gap-3 mb-8">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Main Content Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Sidebar Filters */}
          <aside className={`md:col-span-3 ${isMobileFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6 sticky top-24">
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span>Filter Products</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Categories
                </h4>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition ${
                      selectedCategory === 'all'
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg font-medium transition flex items-center justify-between ${
                        selectedCategory === cat.slug
                          ? 'bg-blue-50 text-blue-600 font-bold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Max Price
                  </h4>
                  <span className="text-xs font-bold text-blue-600">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>$50</span>
                  <span>$2,000</span>
                </div>
              </div>

              {/* Stock Toggle */}
              <div className="pt-4 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span>In-stock items only</span>
                </label>
              </div>

            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="md:col-span-9">
            
            {/* Results Count Bar */}
            <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
              <span>
                Showing <strong className="text-gray-800">{displayedProducts.length}</strong> products
              </span>
              {(searchTerm || selectedCategory !== 'all' || inStockOnly || maxPrice < 2000) && (
                <button
                  onClick={handleResetFilters}
                  className="text-rose-500 hover:underline font-medium"
                >
                  Clear active filters
                </button>
              )}
            </div>

            {/* Loading Skeletons */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse space-y-4">
                    <div className="aspect-square bg-gray-200 rounded-xl w-full" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No matching products</h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6">
                  We couldn't find any products in MongoDB matching your filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}

export default ProductsPage;
