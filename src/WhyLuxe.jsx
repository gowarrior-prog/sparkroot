'use client';

import LuxeMosaic from './components/whyluxe/LuxeMosaic';
import LuxeStory from './components/whyluxe/LuxeStory';
import LuxeNewsletter from './components/whyluxe/LuxeNewsletter';

export default function WhyLuxe() {
  return (
    <section className="bg-white text-slate-900 relative overflow-hidden border-t border-slate-100">
      <LuxeMosaic />
      <LuxeStory />
      <LuxeNewsletter />
    </section>
  );
}