import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import Logo from './Logo';

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

  const footerLinks = {
    Shop: [
      { label: 'All Products', to: '/products' },
      { label: 'Top Deals', to: '/deals' },
      { label: 'Categories', to: '/categories' },
      { label: 'Bestsellers', to: '/products?sort=bestseller' },
    ],
    Account: [
      { label: 'Sign In', to: '/login' },
      { label: 'Register', to: '/register' },
      { label: 'My Orders', to: '/orders' },
      { label: 'Wishlist', to: '/wishlist' },
    ],
    Support: [
      { label: 'Help Center', to: '#' },
      { label: 'Returns', to: '#' },
      { label: 'Shipping Info', to: '#' },
      { label: 'Contact Us', to: '#' },
    ],
  };

  return (
    <footer className="bg-[#080809] border-t border-[#F5F3EE]/10 pt-16 pb-10 text-[#F5F3EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top: Brand + Newsletter + Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-[#F5F3EE]/10">

          {/* Brand col */}
          <div className="lg:col-span-4 space-y-5">
            <Logo />
            <p className="text-sm leading-relaxed max-w-xs text-[#F5F3EE]/50 font-light">
              Curated electronics, architectural audio, and minimalist everyday objects—engineered for enduring performance.
            </p>
          </div>

          {/* Nav links */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-6">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 text-[#C8A97E]">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm transition text-[#F5F3EE]/60 hover:text-[#F5F3EE]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-2 text-[#C8A97E]">Journal</h4>
            <p className="text-sm mb-4 text-[#F5F3EE]/50 font-light">
              Receive seasonal releases and private archive invitations.
            </p>
            {isSubscribed ? (
              <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" /> You're subscribed.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                <div className="flex items-center rounded-full overflow-hidden bg-[#141416] border border-[#F5F3EE]/15 px-3">
                  <Mail className="w-4 h-4 text-[#F5F3EE]/35 flex-shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 bg-transparent py-2.5 px-3 text-sm text-[#F5F3EE] placeholder-[#F5F3EE]/30 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.15em] bg-[#F5F3EE] text-[#0B0B0C] hover:bg-[#C8A97E] transition-all duration-300"
                >
                  Subscribe <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F5F3EE]/40">
          <span>© {new Date().getFullYear()} NovaStore. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Crafted with <Heart className="w-3 h-3 text-[#C8A97E] fill-[#C8A97E]" /> by NovaStore
          </span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#F5F3EE] transition">Privacy</a>
            <a href="#" className="hover:text-[#F5F3EE] transition">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
