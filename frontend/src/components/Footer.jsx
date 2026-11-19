import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
          
          {/* Brand & Mission (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Nova<span className="text-blue-500">Store</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Your destination for cutting-edge electronics, audio gear, and minimalist lifestyle tech. Crafted for performance and built to last.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {/* GitHub */}
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 hover:text-white flex items-center justify-center transition" aria-label="GitHub">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              {/* X / Twitter */}
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 hover:text-white flex items-center justify-center transition" aria-label="X">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 hover:text-white flex items-center justify-center transition" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          {/* Newsletter Subscription (7 cols) */}
          <div className="lg:col-span-7 bg-gray-800/60 rounded-2xl p-6 sm:p-8 border border-gray-700/50 flex flex-col justify-between">
            <div>
              <span className="text-blue-400 font-semibold text-xs uppercase tracking-wider">
                Newsletter
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Get $20 off your first purchase!
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Subscribe to receive private sales, new product drops, and exclusive tech insights.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="mt-5 flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                <span>{isSubscribed ? 'Subscribed!' : 'Subscribe'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Middle Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-gray-800 text-sm">
          {/* Col 1 */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Shop Categories
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/category/audio" className="hover:text-blue-400 transition">Wireless Audio</Link></li>
              <li><Link to="/category/smartwatches" className="hover:text-blue-400 transition">Smartwatches</Link></li>
              <li><Link to="/category/computers" className="hover:text-blue-400 transition">Laptops & PCs</Link></li>
              <li><Link to="/category/gaming" className="hover:text-blue-400 transition">Gaming & VR</Link></li>
              <li><Link to="/deals" className="text-amber-400 hover:text-amber-300 font-medium transition">Flash Deals 🔥</Link></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/help" className="hover:text-blue-400 transition">Help Center & FAQ</Link></li>
              <li><Link to="/track-order" className="hover:text-blue-400 transition">Track Your Order</Link></li>
              <li><Link to="/shipping" className="hover:text-blue-400 transition">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-blue-400 transition">Returns & Exchanges</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="hover:text-blue-400 transition">About NovaStore</Link></li>
              <li><Link to="/careers" className="hover:text-blue-400 transition">Careers</Link></li>
              <li><Link to="/sustainability" className="hover:text-blue-400 transition">Sustainability</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Security & Guarantee
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-gray-400">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>256-bit SSL encrypted transactions for maximum security.</span>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-400 font-semibold mb-2">Accepted Payment Methods</p>
                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-gray-300">
                  <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700">VISA</span>
                  <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700">Mastercard</span>
                  <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700">PayPal</span>
                  <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700">Apple Pay</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} NovaStore, Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> using MERN Stack & Tailwind CSS
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
