import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '../data/categoriesData';

function CategorySection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.reveal-item').forEach((el, i) => {
            setTimeout(() => el.classList.add('opacity-100', 'translate-y-0'), i * 80);
          });
        }
      }),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20" style={{ background: '#080F20' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest gradient-text">
              Explore Collections
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
              Shop by Category
            </h2>
            <p className="text-sm mt-2" style={{ color: 'rgba(240,246,255,0.45)' }}>
              Find exactly what you are looking for across our popular categories.
            </p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition group self-start sm:self-auto"
            style={{ color: '#60A5FA' }}
          >
            <span>All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="reveal-item group relative flex flex-col items-center p-5 rounded-2xl text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 opacity-0 translate-y-4"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(16px)',
                transitionDelay: `${idx * 60}ms`,
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(59,130,246,0.2), 0 8px 32px rgba(0,0,0,0.3)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-4 transition-all duration-300" style={{ border: '2px solid rgba(255,255,255,0.1)' }}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-sm text-white group-hover:text-blue-400 transition">
                {cat.name}
              </h3>
              <span className="text-[11px] mt-1" style={{ color: 'rgba(240,246,255,0.35)' }}>
                {cat.itemCount}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
