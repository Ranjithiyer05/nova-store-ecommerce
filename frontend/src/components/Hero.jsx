import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Headphones, RotateCcw, Star, Zap } from 'lucide-react';

function Hero() {
  const orb1 = useRef(null);
  const orb2 = useRef(null);

  useEffect(() => {
    const handleMouse = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      if (orb1.current) orb1.current.style.transform = `translate(${x}px, ${y}px)`;
      if (orb2.current) orb2.current.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`;
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ background: 'linear-gradient(170deg, #050A14 0%, #080F20 60%, #050A14 100%)' }}>
      {/* Ambient glow orbs (mouse-parallax) */}
      <div ref={orb1} className="pointer-events-none absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-20 transition-transform duration-300 ease-out" style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div ref={orb2} className="pointer-events-none absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-15 transition-transform duration-300 ease-out" style={{ background: 'radial-gradient(circle, #818CF8 0%, transparent 70%)', filter: 'blur(80px)' }} />

      {/* Grid lines background texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[85vh]">

          {/* LEFT: Text content */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', color: '#60A5FA' }}>
              <Zap className="w-3.5 h-3.5" />
              Autumn Exclusive Sale — Up to 40% Off
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
              <span style={{ color: '#F0F6FF' }}>Shop the</span>
              <br />
              <span className="gradient-text">Future of Tech</span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0" style={{ color: 'rgba(240,246,255,0.55)' }}>
              Curated next-generation gadgets, audio gear, and minimalist accessories. Engineered for performance and everyday style.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/products"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #2563EB, #38BDF8)', boxShadow: '0 0 30px rgba(59,130,246,0.4), 0 4px 20px rgba(59,130,246,0.2)' }}
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/deals"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F0F6FF' }}
              >
                View Deals 🔥
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-2">
                {['1534528741775-53994a69daeb','1507003211169-0a1dd7228f2d','1494790108377-be9c29b29330'].map((id, i) => (
                  <img key={i} className="w-9 h-9 rounded-full border-2 object-cover" style={{ borderColor: '#050A14' }} src={`https://images.unsplash.com/photo-${id}?w=100&h=100&fit=crop&crop=faces`} alt="" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  <span className="font-bold text-white text-sm ml-1">4.9/5</span>
                </div>
                <span className="text-xs" style={{ color: 'rgba(240,246,255,0.45)' }}>From 12,000+ customers</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Floating product showcase */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="absolute inset-0 rounded-3xl opacity-30 blur-3xl" style={{ background: 'radial-gradient(circle at 50% 50%, #3B82F6, transparent 70%)' }} />

            <div className="relative w-full max-w-sm float" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '28px', backdropFilter: 'blur(20px)', padding: '20px' }}>
              <div className="relative h-72 w-full rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                  alt="Nova Pro Spatial Headphones"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.3)' }}>
                  🔥 Trending
                </span>
                <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #EF4444, #F97316)' }}>
                  -30%
                </span>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">Nova Pro Spatial Headphones</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(240,246,255,0.45)' }}>ANC • 40hr Battery • Hi-Res Audio</p>
                </div>
                <div className="text-right">
                  <span className="block text-xl font-black gradient-text">$249</span>
                  <span className="text-xs line-through" style={{ color: 'rgba(240,246,255,0.3)' }}>$349</span>
                </div>
              </div>
            </div>

            {/* Floating mini stats cards */}
            <div className="hidden sm:block absolute -left-4 top-1/4 px-4 py-3 rounded-2xl" style={{ background: 'rgba(12,18,33,0.9)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">4.9 Rating</p>
                  <p className="text-[10px]" style={{ color: 'rgba(240,246,255,0.4)' }}>2,840 reviews</p>
                </div>
              </div>
            </div>

            <div className="hidden sm:block absolute -right-4 bottom-1/4 px-4 py-3 rounded-2xl" style={{ background: 'rgba(12,18,33,0.9)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Verified</p>
                  <p className="text-[10px]" style={{ color: 'rgba(240,246,255,0.4)' }}>Hi-Res Certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom trust bar */}
        <div className="mt-8 lg:mt-0 grid grid-cols-2 md:grid-cols-4 gap-4 py-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { icon: Truck, label: 'Free Express Shipping', sub: 'On orders over $50' },
            { icon: ShieldCheck, label: 'Secure Checkout', sub: '256-bit SSL encryption' },
            { icon: RotateCcw, label: '30 Days Return', sub: 'Money back guarantee' },
            { icon: Headphones, label: '24/7 Live Support', sub: 'Dedicated assistance' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <Icon className="w-4.5 h-4.5 text-blue-400" style={{ width: '18px', height: '18px' }} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{label}</h4>
                <p className="text-[11px]" style={{ color: 'rgba(240,246,255,0.4)' }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
