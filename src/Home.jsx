'use client';

import Hero from './Hero';
import TrustBadges from './components/home/TrustBadges';
import ShopByCategory from './components/home/ShopByCategory';
import FeaturedProducts from './FeaturedProducts';
import PromoBanners from './components/home/PromoBanners';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Hero />
      <TrustBadges />
      <ShopByCategory />
      <FeaturedProducts />
      <PromoBanners />
    </main>
  );
}