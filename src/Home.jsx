import Hero from './Hero';
import FeaturedProducts from './FeaturedProducts';
import WhyLuxe from './WhyLuxe';

export default function Home() {
  return (
    <main className="pt-20 md:pt-24 min-h-screen bg-white">
      <Hero />
      <FeaturedProducts />
      <WhyLuxe />
    </main>
  );
}