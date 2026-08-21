'use client';
import { useState, useEffect } from 'react';
import { imageSrc } from '@/lib/utils';

interface Props {
  banners: any[];
}

export default function BannerCarousel({ banners }: Props) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      setCurrent((c) => (c + (diff > 0 ? 1 : -1) + banners.length) % banners.length);
    }
    setTouchStart(null);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl mx-4 mb-4" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {banners.map((banner, i) => (
          <div key={banner.id} className="w-full flex-shrink-0">
            <img
              src={imageSrc(banner.image_path)}
              alt={banner.title}
              className="w-full h-40 md:h-48 object-cover"
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}