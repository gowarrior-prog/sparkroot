'use client';

import React from 'react';
import { Link } from '../../lib/routerCompat';
import { ArrowRight } from 'lucide-react';

export default function ShopByCategory() {
  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Jewelry',
      slug: 'jewelry',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Beauty',
      slug: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Bags',
      slug: 'bags',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: "Men's Wear",
      slug: 'mens-wear',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: "Women's Wear",
      slug: 'womens-wear',
      image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Home & Living',
      slug: 'home-living',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-8 bg-[#f2f2f4] border-b border-gray-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">Shop by Category</h2>
        </div>

        {/* Category Grid — Exactly 4 columns on mobile, 8 on desktop as in media_1790156893554.jpg */}
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/category/${cat.slug}`}
              className="bg-[#eaeaea] hover:bg-[#e4e4e6] border border-gray-300/60 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-14 h-14 sm:w-20 sm:h-20 aspect-square rounded-lg overflow-hidden bg-transparent mb-1.5 flex items-center justify-center p-0.5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-slate-800 group-hover:text-black transition text-center line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
