import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '../data/categoriesData';

function CategorySection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-blue-600 font-semibold text-xs uppercase tracking-wider">
              Explore Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-1">
              Shop by Category
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Find exactly what you are looking for across our popular categories.
            </p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition group self-start sm:self-auto"
          >
            <span>All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid (2 cols mobile, 3 tablet, 6 desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group relative flex flex-col items-center p-4 bg-gray-50 hover:bg-blue-50/50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 text-center overflow-hidden"
            >
              {/* Category Image Circle */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 bg-white shadow-sm ring-4 ring-white group-hover:ring-blue-100 transition duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  loading="lazy"
                />
              </div>

              {/* Category Info */}
              <h3 className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition">
                {cat.name}
              </h3>
              <span className="text-[11px] text-gray-400 mt-0.5">
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
