import React from 'react';

export default function Logo({ 
  className = "h-10", 
  showText = true, 
  variant = "dark",
  textClass = "" 
}) {
  const isLight = variant === "light";

  return (
    <div className="inline-flex items-center gap-3 select-none">
      {/* Round circular logo badge as seen in the reference screenshot */}
      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border ${isLight ? 'border-white/20 bg-white/10' : 'border-slate-300 bg-white'} flex items-center justify-center p-1.5 shrink-0 shadow-xs transition-transform duration-300 hover:scale-105`}>
        <img
          src="/logo.png"
          alt="SparkRoot Logo"
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&auto=format&fit=crop&q=80';
          }}
        />
      </div>

      {showText && (
        <span className={`text-2xl font-semibold tracking-tight ${isLight ? 'text-white' : 'text-slate-900'} ${textClass}`}>
          SparkRoot
        </span>
      )}
    </div>
  );
}
