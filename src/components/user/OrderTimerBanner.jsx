'use client';

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function OrderTimerBanner({ order, onAutoConfirm }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(order.status?.toLowerCase() === 'confirmed' || order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'shipped');

  useEffect(() => {
    if (isConfirmed) return;

    const createdAtMs = new Date(order.createdAt || Date.now()).getTime();
    const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
    const targetTimeMs = createdAtMs + TWO_HOURS_MS;

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTimeMs - now;

      if (diff <= 0) {
        setTimeLeft(0);
        setIsConfirmed(true);
        if (onAutoConfirm) onAutoConfirm(order.id);
      } else {
        setTimeLeft(diff);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order.createdAt, order.id, isConfirmed, onAutoConfirm]);

  if (isConfirmed || order.status?.toLowerCase() === 'canceled') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Order Confirmed & Verified</span>
        </div>
        <span className="text-[10px] uppercase font-extrabold tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
          Status: Confirmed
        </span>
      </div>
    );
  }

  if (timeLeft === null) return null;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-2.5 rounded-xl text-xs font-bold flex flex-wrap items-center justify-between gap-2 shadow-sm border border-amber-400">
      <div className="flex items-center gap-2">
        <Clock size={16} className="animate-spin text-black" style={{ animationDuration: '4s' }} />
        <span>2-Hour Auto-Confirmation Timer</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-black/80">Confirming in:</span>
        <span className="bg-black text-amber-300 px-2.5 py-1 rounded-lg font-mono text-xs font-black tracking-widest">
          {formattedHours}:{formattedMinutes}:{formattedSeconds}
        </span>
      </div>
    </div>
  );
}
