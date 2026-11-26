import React, { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Headphone3D = lazy(() => import('./Headphone3D'));

const HERO_OBJECTS = [
  {
    id: '01',
    tag: '01 / Spatial Audio',
    name: 'Nova Pro Spatial',
    spec: 'Active Noise Cancellation • 40hr Battery',
    price: '$249',
    oldPrice: '$349',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=85',
  },
  {
    id: '02',
    tag: '02 / Tactile Input',
    name: 'Keychron Q1 Pro',
    spec: 'CNC Aluminum • Hot-Swappable Switches',
    price: '$199',
    oldPrice: '$249',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=900&q=85',
  },
  {
    id: '03',
    tag: '03 / Horology',
    name: 'Chronos Minimalist',
    spec: 'Sapphire Glass • Titanium Unibody',
    price: '$329',
    oldPrice: '$410',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85',
  },
];

function Hero() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const { lastAddedEvent } = useCart();

  const activeItem = HERO_OBJECTS[activeIdx];

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (px - 0.5) * 20,
      y: (py - 0.5) * -20,
      glareX: px * 100,
      glareY: py * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const marqueeItems = [
    'ARCHITECTURAL TECH',
    'PRECISION AUDIO',
    'TACTILE OBJECTS',
    'FREE GLOBAL SHIPPING',
    '24-MONTH WARRANTY',
    'ARCHITECTURAL TECH',
    'PRECISION AUDIO',
    'TACTILE OBJECTS',
    'FREE GLOBAL SHIPPING',
    '24-MONTH WARRANTY',
  ];

  return (
    <section className="relative overflow-hidden bg-[#F5F3EE] dark:bg-[#0B0B0C] text-[#0B0B0C] dark:text-[#F5F3EE] transition-colors duration-300">
      {/* Subtle architectural grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Ambient warm champagne glow */}
      <div
        className="pointer-events-none absolute top-[-10%] right-[5%] w-[560px] h-[560px] rounded-full opacity-[0.14] blur-[120px]"
        style={{ background: 'radial-gradient(circle, #C8A97E 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* LEFT: Editorial Typography & Interactive Object Switcher */}
          <div className="lg:col-span-6 space-y-7">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-[#8C6D46] dark:text-[#C8A97E] font-semibold">
              <span className="w-8 h-[1px] bg-[#8C6D46] dark:bg-[#C8A97E]" />
              <span>Collection 01 / Interactive Exhibition</span>
            </div>

            <h1 className="font-serif-editorial text-6xl sm:text-7xl lg:text-[5.25rem] font-normal tracking-tight leading-[1.01]">
              Objects of{' '}
              <span className="italic text-gold-gradient">quiet</span>
              <br />
              precision.
            </h1>

            <p className="text-sm sm:text-base leading-relaxed max-w-md text-[#0B0B0C]/65 dark:text-[#F5F3EE]/60 font-light">
              A curated storefront of architectural audio, tactile workspaces, and enduring everyday technology—engineered with depth and restraint.
            </p>

            {/* Interactive 3D Object Switcher */}
            <div className="space-y-2.5 pt-1">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#0B0B0C]/45 dark:text-[#F5F3EE]/45 font-semibold">
                Select Exhibition Object
              </p>
              <div className="flex flex-wrap gap-2.5">
                {HERO_OBJECTS.map((obj, idx) => (
                  <button
                    key={obj.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${
                      activeIdx === idx
                        ? 'bg-[#0B0B0C] dark:bg-[#F5F3EE] text-[#F5F3EE] dark:text-[#0B0B0C] border-transparent shadow-lg scale-105'
                        : 'bg-transparent border-[#0B0B0C]/15 dark:border-[#F5F3EE]/15 text-[#0B0B0C]/70 dark:text-[#F5F3EE]/65 hover:border-[#8C6D46] dark:hover:border-[#C8A97E]'
                    }`}
                  >
                    {obj.tag}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/products"
                className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#0B0B0C] dark:bg-[#F5F3EE] text-[#F5F3EE] dark:text-[#0B0B0C] text-xs font-semibold uppercase tracking-[0.15em] hover:bg-[#8C6D46] dark:hover:bg-[#C8A97E] transition-all duration-300 shadow-xl"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/deals"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full border border-[#0B0B0C]/20 dark:border-[#F5F3EE]/20 text-xs font-semibold uppercase tracking-[0.15em] hover:border-[#8C6D46] dark:hover:border-[#C8A97E] hover:text-[#8C6D46] dark:hover:text-[#C8A97E] transition-all duration-300"
              >
                <span>Seasonal Archive</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* RIGHT: True 3D Perspective Stage */}
          <div
            className="lg:col-span-6 relative flex justify-center items-center py-8"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '1200px' }}
          >
            {/* Rotating 3D Orbital Ring behind the card */}
            <div
              className="pointer-events-none absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full border border-[#8C6D46]/25 dark:border-[#C8A97E]/20 animate-spin"
              style={{ animationDuration: '28s' }}
            >
              <div className="absolute -top-1.5 left-1/2 w-3 h-3 rounded-full bg-[#C8A97E] shadow-lg" />
            </div>

            {/* 3D Tilting Container */}
            <div
              className="relative w-full max-w-md transition-transform duration-200 ease-out"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              }}
            >
              {/* Main 3D Card */}
              <div className="relative rounded-[30px] overflow-hidden border border-[#0B0B0C]/15 dark:border-[#F5F3EE]/15 bg-[#EAE5DC] dark:bg-[#141416] p-4 shadow-2xl">
                {/* Dynamic Specular Glare */}
                <div
                  className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.18) 0%, transparent 55%)`,
                  }}
                />

                <div className="relative h-[380px] sm:h-[440px] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#F5F3EE] to-[#EAE5DC] dark:from-[#18181B] dark:to-[#101012]">
                  {activeIdx === 0 ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Suspense fallback={null}>
                        <Headphone3D lastAddedEvent={lastAddedEvent} />
                      </Suspense>
                      {/* AUX Cable origin anchor at the bottom of the left earcup */}
                      <span
                        id="hero-headphone-cable-origin"
                        className="absolute bottom-[28%] left-[38%] w-2 h-2 pointer-events-none"
                      />
                    </div>
                  ) : (
                    <img
                      key={activeItem.image}
                      src={activeItem.image}
                      alt={activeItem.name}
                      className="w-full h-full object-cover object-center transition-all duration-700 scale-105"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/75 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full glass-editorial text-[10px] uppercase tracking-widest text-[#F5F3EE]">
                    <Sparkles className="w-3 h-3 text-[#C8A97E]" />
                    <span>Featured Object</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-[#C8A97E]">{activeItem.tag}</p>
                      <h3 className="font-serif-editorial text-2xl text-white mt-0.5">
                        {activeItem.name}
                      </h3>
                      <p className="text-[11px] text-white/65 mt-0.5">{activeItem.spec}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif-editorial text-2xl text-[#F5F3EE]">{activeItem.price}</span>
                      <span className="block text-xs line-through text-[#F5F3EE]/45">{activeItem.oldPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Pop-out Floating Badge 1 (translateZ) */}
              <div
                className="hidden sm:flex absolute -left-8 top-12 glass-editorial px-4 py-3 rounded-2xl items-center gap-3 shadow-2xl float-slow"
                style={{ transform: 'translateZ(45px)' }}
              >
                <div className="w-9 h-9 rounded-xl bg-[#C8A97E]/20 border border-[#C8A97E]/40 flex items-center justify-center text-[#C8A97E]">
                  <Star className="w-4 h-4 fill-[#C8A97E]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F5F3EE]">{activeItem.rating} / 5.0</p>
                  <p className="text-[10px] text-[#F5F3EE]/55">Verified Rating</p>
                </div>
              </div>

              {/* 3D Pop-out Floating Badge 2 (translateZ) */}
              <div
                className="hidden sm:flex absolute -right-6 bottom-16 glass-editorial px-4 py-3 rounded-2xl items-center gap-3 shadow-2xl"
                style={{ transform: 'translateZ(55px)' }}
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F5F3EE]">24m Warranty</p>
                  <p className="text-[10px] text-[#F5F3EE]/55">Global Coverage</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Animated Editorial Marquee Ticker */}
      <div className="border-y border-[#0B0B0C]/10 dark:border-[#F5F3EE]/10 bg-[#EAE5DC] dark:bg-[#111113] py-3.5 overflow-hidden">
        <div className="animate-marquee flex items-center gap-10 text-[11px] uppercase tracking-[0.25em] text-[#0B0B0C]/70 dark:text-[#F5F3EE]/60 font-medium">
          {marqueeItems.map((item, idx) => (
            <span key={idx} className="flex items-center gap-10 whitespace-nowrap">
              <span>{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D46] dark:bg-[#C8A97E]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
