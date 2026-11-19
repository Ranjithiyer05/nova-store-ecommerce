import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Headphones, RotateCcw, Sparkles, Star } from 'lucide-react';

function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-gray-50/30 pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Decorative Blur Circles */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 -z-10 w-72 h-72 bg-indigo-100/50 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Description & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Autumn Exclusive Sale • Up to 40% Off</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
              Experience Premium Tech & Lifestyle Essentials.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Curated collection of next-generation gadgets, audio gear, and minimalist accessories. Engineered for performance and everyday style.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/deals"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition"
              >
                View Top Deals 🔥
              </Link>
            </div>

            {/* Mini Social Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 text-xs text-gray-500">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" alt="User 1" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" alt="User 2" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" alt="User 3" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="font-bold text-gray-900 ml-1">4.9/5</span>
                </div>
                <span>From over 12,000+ satisfied customers</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Visual Card (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Main Product Feature Card */}
            <div className="relative w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl shadow-blue-500/10 border border-gray-100">
              {/* Product Image */}
              <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-gray-100 group">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                  alt="Nova Pro Spatial Audio Wireless Headphones"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                  Trending
                </span>
                <span className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                  -30%
                </span>
              </div>

              {/* Product Details Bar */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Nova Pro Spatial Headphones</h3>
                  <p className="text-xs text-gray-500">Active Noise Cancellation • 40hr Battery</p>
                </div>
                <div className="text-right">
                  <span className="block text-lg font-extrabold text-blue-600">$249</span>
                  <span className="text-xs text-gray-400 line-through">$349</span>
                </div>
              </div>

              {/* Floating Feature Tag */}
              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md border border-gray-100 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Sound Engine</p>
                  <p className="text-xs font-bold text-gray-800">Hi-Res Audio Certified</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Trust Indicators / Features Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-gray-200/70">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Free Express Shipping</h4>
              <p className="text-xs text-gray-500">On all orders over $50</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Secure Checkout</h4>
              <p className="text-xs text-gray-500">256-bit SSL encryption</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">30 Days Return</h4>
              <p className="text-xs text-gray-500">Money back guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">24/7 Live Support</h4>
              <p className="text-xs text-gray-500">Dedicated assistance</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Hero;
