import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';

function Hero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const marqueeItems = [
    'ARCHITECTURAL TECH',
    'PRECISION AUDIO',
    'FREE GLOBAL SHIPPING',
    '24-MONTH WARRANTY',
    'CURATED OBJECTS',
    'MINIMALIST DESIGN',
    'ARCHITECTURAL TECH',
    'PRECISION AUDIO',
    'FREE GLOBAL SHIPPING',
    '24-MONTH WARRANTY',
    'CURATED OBJECTS',
    'MINIMALIST DESIGN',
  ];

  return (
    <section className="relative overflow-hidden bg-[#F5F3EE] dark:bg-[#0B0B0C] text-[#0B0B0C] dark:text-[#F5F3EE] transition-colors duration-300">
      {/* Subtle architectural hairline grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Warm champagne radial ambient light (zero purple) */}
      <div
        className="pointer-events-none absolute top-[-15%] right-[5%] w-[520px] h-[520px] rounded-full opacity-[0.12] blur-[110px]"
        style={{ background: 'radial-gradient(circle, #C8A97E 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* LEFT: Editorial Typography & CTAs (6 cols) */}
          <div className="lg:col-span-6 space-y-8">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#C8A97E] font-medium">
              <span className="w-8 h-[1px] bg-[#C8A97E]" />
              <span>Collection 01 / Curated Essentials</span>
            </div>

            <h1 className="font-serif-editorial text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.04] text-[#0B0B0C] dark:text-[#F5F3EE]">
              Objects of{' '}
              <span className="italic text-gold-gradient">quiet</span>
              <br />
              precision.
            </h1>

            <p className="text-sm sm:text-base leading-relaxed max-w-md text-[#0B0B0C]/65 dark:text-[#F5F3EE]/60 font-light">
              A curated storefront of architectural audio, tactile workspaces, and enduring everyday technology—designed to elevate your environment.
            </p>

            {/* Editorial CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/products"
                className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#0B0B0C] dark:bg-[#F5F3EE] text-[#F5F3EE] dark:text-[#0B0B0C] text-xs font-semibold uppercase tracking-[0.15em] hover:bg-[#8C6D46] dark:hover:bg-[#C8A97E] transition-all duration-300"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/deals"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full border border-[#0B0B0C]/20 dark:border-[#F5F3EE]/20 text-[#0B0B0C] dark:text-[#F5F3EE] text-xs font-semibold uppercase tracking-[0.15em] hover:border-[#8C6D46] dark:hover:border-[#C8A97E] hover:text-[#8C6D46] dark:hover:text-[#C8A97E] transition-all duration-300"
              >
                <span>Seasonal Archive</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* Minimalist Specs Row */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#0B0B0C]/10 dark:border-[#F5F3EE]/10 max-w-md">
              <div>
                <p className="font-serif-editorial text-2xl text-[#0B0B0C] dark:text-[#F5F3EE]">4.9</p>
                <p className="text-[11px] uppercase tracking-wider text-[#0B0B0C]/50 dark:text-[#F5F3EE]/45 mt-0.5">Client Rating</p>
              </div>
              <div>
                <p className="font-serif-editorial text-2xl text-[#0B0B0C] dark:text-[#F5F3EE]">12k+</p>
                <p className="text-[11px] uppercase tracking-wider text-[#0B0B0C]/50 dark:text-[#F5F3EE]/45 mt-0.5">Objects Shipped</p>
              </div>
              <div>
                <p className="font-serif-editorial text-2xl text-[#0B0B0C] dark:text-[#F5F3EE]">24m</p>
                <p className="text-[11px] uppercase tracking-wider text-[#0B0B0C]/50 dark:text-[#F5F3EE]/45 mt-0.5">Global Warranty</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Interactive 3D Tilt Gallery Card (6 cols) */}
          <div
            className="lg:col-span-6 relative flex justify-center lg:justify-end"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="relative w-full max-w-md transition-transform duration-300 ease-out"
              style={{
                transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              }}
            >
              {/* Main Gallery Frame */}
              <div className="relative rounded-[28px] overflow-hidden border border-[#F5F3EE]/10 bg-[#141416] p-4 shadow-2xl">
                <div className="relative h-[380px] sm:h-[420px] w-full rounded-2xl overflow-hidden bg-[#1C1C1F]">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=85"
                    alt="Nova Pro Spatial Headphones"
                    className="w-full h-full object-cover object-center scale-105 hover:scale-110 transition-transform duration-700"
                  />
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/70 via-transparent to-transparent" />

                  {/* Top editorial tag */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full glass-editorial text-[11px] uppercase tracking-widest text-[#F5F3EE]">
                    <Sparkles className="w-3 h-3 text-[#C8A97E]" />
                    <span>Featured Object</span>
                  </div>

                  {/* Bottom overlay info */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-[#C8A97E]">01 / Audio</p>
                      <h3 className="font-serif-editorial text-xl text-white mt-0.5">
                        Nova Pro Spatial
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-[#F5F3EE]">$249</span>
                      <span className="block text-xs line-through text-[#F5F3EE]/40">$349</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Glass Spec Pill */}
              <div className="hidden sm:flex absolute -left-8 bottom-12 glass-editorial px-4 py-3 rounded-2xl items-center gap-3 float-slow shadow-xl">
                <div className="w-9 h-9 rounded-xl bg-[#C8A97E]/15 border border-[#C8A97E]/30 flex items-center justify-center text-[#C8A97E]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F5F3EE]">Hi-Res Certified</p>
                  <p className="text-[11px] text-[#F5F3EE]/50">Active Noise Cancellation</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Animated Editorial Marquee Ticker */}
      <div className="border-y border-[#F5F3EE]/10 bg-[#111113] py-3.5 overflow-hidden">
        <div className="animate-marquee flex items-center gap-10 text-[11px] uppercase tracking-[0.25em] text-[#F5F3EE]/60 font-medium">
          {marqueeItems.map((item, idx) => (
            <span key={idx} className="flex items-center gap-10 whitespace-nowrap">
              <span>{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
