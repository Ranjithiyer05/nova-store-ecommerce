import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Shield, ChevronDown, Heart, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import Logo from './Logo';

function Navbar() {
  const { user, logout } = useAuth();
  const { totalItemCount, wishlistItems } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Live Auto-complete Search States
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  // Debounced live search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowResultsDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await api.get('/products', {
          params: { keyword: searchQuery.trim() },
        });
        setSearchResults((res.data.products || []).slice(0, 5));
        setShowResultsDropdown(true);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search preview on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowResultsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResultsDropdown(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectProduct = (productId) => {
    setShowResultsDropdown(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F5F3EE]/85 dark:bg-[#0B0B0C]/85 backdrop-blur-xl border-b border-[#0B0B0C]/10 dark:border-[#F5F3EE]/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* 1. Brand Logo */}
          <Logo />

          {/* 2. Search Bar with Live Auto-complete Preview */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md relative">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full relative flex items-center"
            >
              <input
                type="text"
                placeholder="Search objects, brands, categories..."
                value={searchQuery}
                onFocus={() => {
                  if (searchResults.length > 0) setShowResultsDropdown(true);
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#EAE5DC]/70 dark:bg-[#141416] border border-[#0B0B0C]/15 dark:border-[#F5F3EE]/15 rounded-full py-2 pl-10 pr-4 text-sm text-[#0B0B0C] dark:text-[#F5F3EE] placeholder-[#0B0B0C]/40 dark:placeholder-[#F5F3EE]/35 focus:outline-none focus:border-[#8C6D46] dark:focus:border-[#C8A97E]/60 transition"
              />
              <Search className="w-4 h-4 text-[#0B0B0C]/45 dark:text-[#F5F3EE]/40 absolute left-3.5 pointer-events-none" />
              {isSearching && (
                <div className="w-3.5 h-3.5 border-2 border-[#8C6D46] dark:border-[#C8A97E] border-t-transparent rounded-full animate-spin absolute right-3.5 pointer-events-none" />
              )}
            </form>

            {/* Auto-complete Results Floating Card */}
            {showResultsDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#F5F3EE] dark:bg-[#141416] rounded-2xl shadow-2xl border border-[#0B0B0C]/15 dark:border-[#F5F3EE]/15 py-2 z-50 overflow-hidden">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-[#8C6D46] dark:text-[#C8A97E] uppercase tracking-[0.2em] flex justify-between">
                  <span>Instant Results</span>
                  <span>{searchResults.length} found</span>
                </div>
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleSelectProduct(item._id)}
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#0B0B0C]/5 dark:hover:bg-[#F5F3EE]/5 transition text-left"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg bg-[#EAE5DC] dark:bg-[#1B1B1E] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#0B0B0C] dark:text-[#F5F3EE] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#0B0B0C]/55 dark:text-[#F5F3EE]/50">{item.brand} • ${item.price.toFixed(2)}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs text-[#0B0B0C]/50 dark:text-[#F5F3EE]/40 text-center">
                    No objects matching "{searchQuery}"
                  </div>
                )}
                <div className="border-t border-[#0B0B0C]/10 dark:border-[#F5F3EE]/10 p-2 text-center bg-[#EAE5DC]/40 dark:bg-[#0B0B0C]/40">
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs font-semibold text-[#8C6D46] dark:text-[#C8A97E] hover:underline"
                  >
                    View all matching objects ➔
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-medium uppercase tracking-[0.15em] text-[#0B0B0C]/70 dark:text-[#F5F3EE]/65">
            <Link to="/" className="hover:text-[#0B0B0C] dark:hover:text-[#F5F3EE] transition">
              Home
            </Link>
            <Link to="/products" className="hover:text-[#0B0B0C] dark:hover:text-[#F5F3EE] transition">
              Catalog
            </Link>
            <Link to="/deals" className="text-[#8C6D46] dark:text-[#C8A97E] hover:opacity-80 transition">
              Archive
            </Link>
          </nav>

          {/* 4. Action Buttons (Theme Toggle, User Profile, Wishlist & Cart) */}
          <div className="flex items-center gap-2">

            {/* Theme Mode Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle color mode"
              title={isDark ? 'Switch to Normal Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-full bg-[#EAE5DC]/70 dark:bg-[#141416] border border-[#0B0B0C]/10 dark:border-[#F5F3EE]/15 text-[#0B0B0C] dark:text-[#C8A97E] hover:scale-105 transition"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile Dropdown or Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-[#141416] hover:bg-[#1C1C1F] border border-[#F5F3EE]/15 text-[#F5F3EE] text-xs font-medium transition"
                >
                  <div className="w-6 h-6 rounded-full bg-[#C8A97E] text-[#0B0B0C] flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#F5F3EE]/50" />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#141416] rounded-2xl shadow-2xl border border-[#F5F3EE]/15 py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-[#F5F3EE]/10">
                      <p className="font-semibold text-[#F5F3EE] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#F5F3EE]/45 truncate">{user.email}</p>
                    </div>

                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[#C8A97E] font-semibold hover:bg-[#F5F3EE]/5 transition"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="block px-4 py-2 text-[#F5F3EE]/75 hover:bg-[#F5F3EE]/5 transition"
                    >
                      My Orders
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition font-medium border-t border-[#F5F3EE]/10 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F5F3EE] text-[#0B0B0C] hover:bg-[#C8A97E] transition text-xs font-semibold uppercase tracking-wider"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Wishlist Link Button */}
            <Link
              to="/wishlist"
              className="relative p-2 text-[#0B0B0C]/75 dark:text-[#F5F3EE]/70 hover:text-[#8C6D46] dark:hover:text-[#C8A97E] hover:bg-[#0B0B0C]/5 dark:hover:bg-[#F5F3EE]/5 rounded-full transition flex items-center justify-center"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#8C6D46] dark:bg-[#C8A97E] text-white dark:text-[#0B0B0C] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-[#0B0B0C]/75 dark:text-[#F5F3EE]/70 hover:text-[#8C6D46] dark:hover:text-[#C8A97E] hover:bg-[#0B0B0C]/5 dark:hover:bg-[#F5F3EE]/5 rounded-full transition flex items-center justify-center"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#0B0B0C] dark:bg-[#F5F3EE] text-[#F5F3EE] dark:text-[#0B0B0C] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-[#0B0B0C]/75 dark:text-[#F5F3EE]/70 hover:bg-[#0B0B0C]/5 dark:hover:bg-[#F5F3EE]/5 transition"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search objects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141416] border border-[#F5F3EE]/15 rounded-full py-2 pl-10 pr-4 text-sm text-[#F5F3EE] placeholder-[#F5F3EE]/35 focus:outline-none focus:border-[#C8A97E]/60 transition"
            />
            <Search className="w-4 h-4 text-[#F5F3EE]/40 absolute left-3.5 top-2.5 pointer-events-none" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#F5F3EE]/10 bg-[#0B0B0C] px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm uppercase tracking-wider font-medium text-[#F5F3EE]/80 hover:text-[#C8A97E]"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm uppercase tracking-wider font-medium text-[#F5F3EE]/80 hover:text-[#C8A97E]"
          >
            Catalog
          </Link>
          <Link
            to="/deals"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm uppercase tracking-wider font-medium text-[#C8A97E]"
          >
            Archive
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
