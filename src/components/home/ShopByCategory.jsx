'use client';

import React from 'react';
import { Link } from '../../lib/routerCompat';
import { ArrowRight } from 'lucide-react';

export default function ShopByCategory() {
  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      image: '/images/categories/electronics.png',
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      image: '/images/categories/fashion.png',
    },
    {
      name: 'Jewelry',
      slug: 'jewelry',
      image: '/images/categories/jewelry.png',
    },
    {
      name: 'Beauty',
      slug: 'cosmetics',
      image: '/images/categories/cosmetics.png',
    },
    {
      name: 'Bags',
      slug: 'bags',
      image: '/images/categories/bags.png',
    },
    {
      name: "Men's Wear",
      slug: 'mens-wear',
      image: '/images/categories/mens-wear.png',
    },
    {
      name: "Women's Wear",
      slug: 'womens-wear',
      image: '/images/categories/womens-wear.png',
    },
    {
      name: 'Toys & Games',
      slug: 'toys',
      image: '/images/categories/toys.png',
    },
  ];

  return (
    <section className="py-8 bg-[#f8f8fa] border-b border-gray-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">Shop by Category</h2>
        </div>

        {/* Category Grid — Clean Studio Product Icon Cards matching user screenshot */}
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/category/${cat.slug}`}
              className="bg-white hover:bg-slate-50 border border-gray-200/90 rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center justify-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-14 h-14 sm:w-20 sm:h-20 aspect-square rounded-xl overflow-hidden bg-white mb-2 flex items-center justify-center p-1">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-700 group-hover:text-black transition text-center line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
