// src/pages/About.jsx
import { Link } from 'react-router-dom';
import { Sparkles, Diamond, Heart, ShieldCheck, Truck, Recycle } from 'lucide-react';
import SEO from './SEO';

export default function About() {
  return (
    <>
      <SEO title="About Us" description="Learn more about SPARKROOT's mission, values, and commitment to quality." />
      <div className="min-h-screen bg-white text-slate-900 pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 uppercase">
            About <span className="text-slate-400">SPARK</span>ROOT
          </h1>
          
          <p className="text-xl md:text-3xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Where timeless elegance meets contemporary luxury.
            <br className="hidden md:block" />
            Curated collections for those who appreciate the extraordinary.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                Our <span className="text-slate-400">Story</span>
              </h2>
              
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Founded in the heart of passion for exceptional fashion, SPARKROOT was born from a simple belief: 
                true luxury is not about extravagance, but about timeless pieces that become part of your story.
              </p>
              
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                We travel the world to discover artisans, emerging designers, and heritage brands that create with 
                intention, integrity, and unmatched craftsmanship. Every piece in our collection is selected with care 
                — not for trends, but for enduring beauty and quality.
              </p>

              <div className="pt-6">
                <Link
                  to="/"
                  className="inline-flex items-center px-8 py-4 bg-black hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-sm"
                >
                  Explore Our Collections
                </Link>
              </div>
            </div>

            {/* Right side - Image/Visual */}
            <div className="relative rounded-sm overflow-hidden shadow-sm border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Luxury fashion atelier"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 uppercase tracking-tight">
            Our <span className="text-slate-400">Core Values</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: Diamond,
                title: "Uncompromising Quality",
                desc: "We partner only with artisans and brands that uphold the highest standards of craftsmanship and materials."
              },
              {
                icon: Heart,
                title: "Ethical & Sustainable",
                desc: "Luxury should never come at the cost of people or planet. We prioritize fair trade, eco-conscious materials, and transparent supply chains."
              },
              {
                icon: ShieldCheck,
                title: "Curated Authenticity",
                desc: "Every piece is hand-selected for authenticity, timeless design, and emotional value — not fast fashion."
              },
            ].map((value, idx) => (
              <div
                key={idx}
                className="
                  bg-slate-50 border border-slate-200 
                  rounded-sm p-8 text-center transition-all duration-300 
                  hover:border-slate-400 hover:shadow-md hover:-translate-y-2
                "
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                  <value.icon size={28} className="text-black" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-widest mb-4">{value.title}</h3>
                <p className="text-slate-500 font-medium">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Why Choose Us */}
      <section className="py-20 md:py-32 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 uppercase tracking-tight">
            Why <span className="text-slate-400">SPARK</span>ROOT?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: Truck, title: "Worldwide Express Shipping", desc: "Free shipping on orders over PKR 10,000. Delivery in 3–7 days worldwide." },
              { icon: Recycle, title: "24-Hour Cancellation", desc: "Changed your mind? Cancel your order within 24 hours — no questions asked." },
              { icon: ShieldCheck, title: "Secure Shopping", desc: "256-bit SSL encryption, trusted payment gateways, and buyer protection." },
            ].map((feature, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                  <feature.icon size={28} className="text-black" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-widest">{feature.title}</h3>
                <p className="text-slate-500 font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tight">
            Ready to Experience <span className="text-slate-400">True Luxury</span>?
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 font-medium">
            Join thousands of discerning customers who choose SPARKROOT for pieces that last a lifetime.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-10 py-5 bg-black hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-sm"
            >
              Explore Collections
            </Link>
            
            <Link
              to="/"
              className="inline-flex items-center justify-center px-10 py-5 border-2 border-black text-black hover:bg-black hover:text-white font-bold uppercase tracking-widest text-sm transition-all duration-300"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}