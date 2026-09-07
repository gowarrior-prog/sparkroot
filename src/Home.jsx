'use client';

import Hero from './Hero';
import PressTicker from './components/home/PressTicker';
import CategoryShowcase from './components/home/CategoryShowcase';
import FeaturedProducts from './FeaturedProducts';
import WhyLuxe from './WhyLuxe';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <PressTicker />
      <CategoryShowcase />
      <div id="featured-products">
        <FeaturedProducts />
      </div>
      <WhyLuxe />
    </main>
  );
}