'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/cart';
import { ShoppingBag, Search, Mic, Download, UserCircle, LogIn } from 'lucide-react';
import { getHeaderTheme, getHeaderThemeStyles } from '@/lib/utils';

export default function Header() {
  const [theme, setTheme] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const { count } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const t = getHeaderTheme();
    setTheme(t);
  }, []);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length >= 2) {
      fetch(`/api/search?q=${encodeURIComponent(value)}`)
        .then((r) => r.json())
        .then((data) => setSuggestions(data.results?.map((p: any) => p.name) || []));
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header
      className="sticky top-0 z-50"
      style={getHeaderThemeStyles(theme)}
    >
      <div className="relative">
        <svg
          className="absolute top-[-20px] left-[-30px] w-[140px] h-[140px] opacity-20 pointer-events-none"
          viewBox="0 0 64 64"
          fill="none"
          style={{ animation: 'leafSway 6s ease-in-out infinite', transformOrigin: 'top left' }}
        >
          <path
            fill="white"
            d="M62 0C45 0 28 10 16 28 12 24 8 20 2 20c4 8 10 14 16 18-4 2-8 3-14 3 6 4 14 5 22 2 4 10 6 18 4 24 6-6 10-14 12-22 10-4 18-10 24-18-4 4-10 6-16 6C54 28 60 16 62 0z"
          />
        </svg>
        <svg
          className="absolute top-[-10px] right-[-40px] w-[170px] h-[170px] opacity-15 pointer-events-none"
          viewBox="0 0 64 64"
          fill="none"
          style={{ animation: 'leafSway 8s ease-in-out infinite alternate-reverse', transformOrigin: 'top right' }}
        >
          <path
            fill="white"
            d="M62 0C45 0 28 10 16 28 12 24 8 20 2 20c4 8 10 14 16 18-4 2-8 3-14 3 6 4 14 5 22 2 4 10 6 18 4 24 6-6 10-14 12-22 10-4 18-10 24-18-4 4-10 6-16 6C54 28 60 16 62 0z"
          />
        </svg>

        <style jsx>{`
          @keyframes leafSway {
            0% { transform: rotate(-5deg); }
            50% { transform: rotate(6deg); }
            100% { transform: rotate(-5deg); }
          }
        `}</style>

        <div className="container pt-2 pb-3 px-4 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <Link href="/" className="text-decoration-none">
              <div className="text-3xl font-black tracking-tight text-white leading-none">ANP MART</div>
              <div className="text-xs font-black text-amber-300 uppercase tracking-wider mt-1">happy to serve you better</div>
            </Link>
            <div className="flex items-center gap-2">
              <a
                href="/uploads/anpmart.apk"
                download="ANPMart.apk"
                className="px-3 py-1.5 text-xs font-bold text-white bg-white/20 border border-white/30 rounded-lg backdrop-blur"
              >
                <Download className="w-3 h-3 mr-1" /> App
              </a>
              <Link href="/profile" className="text-white/90 hover:text-white">
                <UserCircle className="w-6 h-6" />
              </Link>
            </div>
          </div>

          <div className="mb-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-red-700 text-xs font-bold">
            <span className="animate-pulse">⚡</span>
            <span className="mx-2">Flash Deals Active! Grab up to 50% OFF</span>
            <span className="mx-2">•</span>
            <span>📉 Price Drop Alerts</span>
            <span className="mx-2">•</span>
            <span>📦 Bulk Rates Available</span>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur rounded-xl shadow-lg p-1 px-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for groceries..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-gray-800 placeholder:text-gray-400"
                onChange={handleSearchInput}
                value={searchQuery}
              />
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>

            {searchQuery.length >= 2 && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <Link
                    key={i}
                    href={`/search?q=${encodeURIComponent(s)}`}
                    className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    <span>{s}</span>
                  </Link>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </header>
  );
}