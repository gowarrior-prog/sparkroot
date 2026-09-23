import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, Lock } from 'lucide-react';

export default function LuxeNewsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <div className="pb-16 sm:pb-20 pt-2 sm:pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-50/90 via-white to-amber-100/80 p-6 sm:p-14 border border-amber-200/80 text-slate-900 overflow-hidden shadow-xl">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 p-8 text-amber-900/5 pointer-events-none hidden sm:block">
            <Sparkles size={180} />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white text-amber-800 border border-amber-300/80 text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-xs">
              <Sparkles size={12} className="text-amber-600" />
              VIP ATELIER ACCESS
            </span>

            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-950 tracking-tight">
              Join The Sparkroot Privé Club
            </h3>

            <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
              Subscribe to receive private invitations to unreleased jewelry drops, bespoke styling offers, and an instant 10% privilege discount on your first atelier purchase.
            </p>

            {subscribed ? (
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-3 animate-fade-in shadow-xs">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>Welcome to Sparkroot Privé! Check your inbox for your 10% privilege code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your VIP email address..."
                  required
                  className="flex-1 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition shadow-inner"
                />
                <button
                  type="submit"
                  className="px-7 py-3 sm:py-3.5 rounded-full bg-black hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest transition shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <Send size={13} />
                </button>
              </form>
            )}

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-500 text-[10px] sm:text-[11px] font-medium pt-1">
              <span className="flex items-center gap-1"><Lock size={12} className="text-amber-700" /> 100% Secure & Private</span>
              <span>• No Spam</span>
              <span>• Unsubscribe Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
