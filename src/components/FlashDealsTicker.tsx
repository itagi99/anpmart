'use client';
import { useState, useEffect, useRef } from 'react';

interface Props {
  text?: string;
}

export default function FlashDealsTicker({ text = 'Flash Deals Active! Grab up to 50% OFF on daily essentials • Price Drop Alerts inside! • Bulk Rates Available! Save More!' }: Props) {
  const [position, setPosition] = useState(0);
  const [width, setWidth] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setWidth(textRef.current.scrollWidth);
    }
  }, []);

  useEffect(() => {
    const duration = width / 50; // pixels per second
    const timer = setInterval(() => {
      setPosition((p) => {
        if (p <= -width) return window.innerWidth;
        return p - 1;
      });
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [width]);

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mx-4 mb-3 flex items-center overflow-hidden">
      <div className="flex items-center gap-2 text-red-700 text-xs font-bold whitespace-nowrap" style={{ transform: `translateX(${position}px)` }}>
        <span className="animate-pulse">⚡</span>
        <span ref={textRef}>{text}</span>
        <span className="mx-2">•</span>
        <span>📉 Price Drop Alerts</span>
        <span className="mx-2">•</span>
        <span>📦 Bulk Rates Available</span>
      </div>
    </div>
  );
}