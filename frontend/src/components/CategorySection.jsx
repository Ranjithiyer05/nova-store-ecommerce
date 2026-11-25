import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { categories } from '../data/categoriesData';

function CategorySection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-item').forEach((el, i) => {
              setTimeout(() => {
                el.classList.add('opacity-100', 'translate-y-0');
              }, i * 75);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-[#F5F3EE] text-[#0B0B0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 pb-6 border-b border-[#0B0B0C]/10">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8C6D46]">
              Curated Departments
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-normal tracking-tight mt-2 text-[#0B0B0C]">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#0B0B0C] hover:text-[#8C6D46] transition group self-start sm:self-auto"
          >
            <span>View All Collections</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Gallery Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="reveal-item group flex flex-col bg-[#EAE5DC]/70 hover:bg-[#EAE5DC] rounded-2xl p-4 border border-[#0B0B0C]/5 hover:border-[#0B0B0C]/20 transition-all duration-500 hover:-translate-y-1.5 opacity-0 translate-y-6"
              style={{ transitionDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#0B0B0C]/45 mb-3">
                <span>{String(idx + 1).padStart(2, '0')}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="aspect-square w-full rounded-xl overflow-hidden mb-4 bg-white/60">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              <h3 className="font-medium text-sm text-[#0B0B0C] group-hover:text-[#8C6D46] transition">
                {cat.name}
              </h3>
              <span className="text-[11px] text-[#0B0B0C]/50 mt-0.5">
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
