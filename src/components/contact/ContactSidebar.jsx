import React from 'react';
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react';

export default function ContactSidebar() {
  return (
    <div className="md:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6">
      <h3 className="text-base font-bold text-slate-900 border-b border-gray-100 pb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-black" />
        <span>Get In Touch</span>
      </h3>

      <div className="space-y-4 text-xs">
        <div className="flex items-start gap-3 p-3 bg-[#f4f4f6] rounded-2xl">
          <Mail size={18} className="text-black shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">Email Us</span>
            <a href="mailto:sparkrootofficial@gmail.com" className="text-gray-600 hover:text-black transition">
              sparkrootofficial@gmail.com
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-[#f4f4f6] rounded-2xl">
          <Phone size={18} className="text-black shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">Call / WhatsApp</span>
            <a href="tel:+923447821114" className="text-gray-600 hover:text-black transition font-semibold">
              +92 344 7821114
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-[#f4f4f6] rounded-2xl">
          <MapPin size={18} className="text-black shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">Location</span>
            <span className="text-gray-600">Pakistan (Express Nationwide Shipping)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
