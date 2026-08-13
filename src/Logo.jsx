import React from 'react';

export default function Logo({ 
  className = "h-9", 
  showText = true, 
  variant = "dark",
  textClass = "" 
}) {
  const textColor = variant === "light" ? "text-white" : "text-black";

  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <img src="/logo.png" alt="SparkRoot Logo" className="h-full object-contain" />
    </div>
  );
}
