'use client';

import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Headset } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: <Truck className="w-6 h-6 text-slate-900" />,
      title: 'Free Shipping',
      sub: 'On Orders Above PKR 5,000',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-slate-900" />,
      title: 'Secure Payment',
      sub: '100% Secure',
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-slate-900" />,
      title: 'Easy Returns',
      sub: 'Within 7 Days',
    },
    {
      icon: <Headset className="w-6 h-6 text-slate-900" />,
      title: '24/7 Support',
      sub: "We're Here to Help",
    },
  ];

  return (
    <section className="py-4 bg-[#f2f2f4] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f2f2f4] border border-gray-300/60 rounded-xl py-6 px-4 shadow-2xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-300/50">
            {badges.map((b, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 px-2 pt-3 md:pt-0">
                <div className="p-2.5 rounded-full bg-white border border-gray-200 shrink-0 shadow-2xs">
                  {b.icon}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">{b.title}</h4>
                  <p className="text-[10px] sm:text-[11px] text-gray-600 font-medium mt-0.5">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
