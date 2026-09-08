'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppConcierge() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Hide on admin routes — AFTER all hooks!
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Correct international format (Pakistan +92)
  const phoneNumber = '923467291114';   // ← fixed (removed 0 and space)
  const defaultText = encodeURIComponent('Hello SPARKROOT, I would like assistance with a luxury product.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultText}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 select-none">
      {/* Expanded Quick Card */}
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-md text-slate-900 border border-slate-200/80 p-4 rounded-2xl shadow-2xl w-72 mb-1">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">VIP Concierge Live</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close message"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Welcome to SPARKROOT Concierge. Have a question about sizing, custom orders, or shipping?
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs tracking-wider rounded-xl shadow-md shadow-emerald-600/20 transition-all duration-200 active:scale-95"
          >
            <MessageCircle size={16} className="fill-current" />
            <span>START WHATSAPP CHAT</span>
          </a>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="group relative flex items-center">
        {/* Tooltip on Hover */}
        {!isOpen && (
          <div className="mr-3 hidden md:flex items-center bg-slate-900 text-white text-[11px] font-medium tracking-wide px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            Chat with Luxury Specialist
            <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mr-1 ml-1.5"></div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="SPARKROOT WhatsApp Concierge"
          className="relative flex items-center justify-center w-14 h-14 bg-slate-900 hover:bg-emerald-600 text-white rounded-full shadow-xl shadow-slate-900/20 hover:shadow-emerald-600/30 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {/* Green Online Pulse Dot */}
          <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
          </span>

          <MessageCircle size={24} className="text-white group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}