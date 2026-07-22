import React from 'react';

export default function Logo({ 
  className = "h-9", 
  showText = true, 
  variant = "dark",
  textClass = "" 
}) {
  const textColor = variant === "light" ? "text-white" : "text-black";

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <svg 
        viewBox="0 0 200 200" 
        className="h-full aspect-square shrink-0" 
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background emblem shape - stylized 'S' with inner groove */}
        <g fill="currentColor" className={textColor}>
          {/* Outer sharp S shape */}
          <path 
            d="M 115 12 
               L 162 20 
               L 195 135 
               L 155 135 
               L 128 72 
               L 82 135 
               L 125 135 
               L 105 162 
               L 55 162 
               L 115 80 
               L 60 80 
               L 115 12 Z" 
          />
          {/* Lower sharp S wing & interlocking lightning cut */}
          <path 
            d="M 85 188 
               L 38 180 
               L 5 65 
               L 45 65 
               L 72 128 
               L 118 65 
               L 75 65 
               L 95 38 
               L 145 38 
               L 85 120 
               L 140 120 
               L 85 188 Z" 
          />
        </g>
      </svg>

      {showText && (
        <span 
          className={`font-black tracking-widest uppercase italic text-xl sm:text-2xl font-sans ${textColor} ${textClass}`}
          style={{ fontFamily: "'Inter', 'Montserrat', system-ui, sans-serif" }}
        >
          SPARKROOT
        </span>
      )}
    </div>
  );
}
