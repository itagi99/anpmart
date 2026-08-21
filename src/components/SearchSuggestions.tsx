'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SearchSuggestions({ value, onChange, onSubmit }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => {
        fetch(`/api/search?q=${encodeURIComponent(value)}`)
          .then((r) => r.json())
          .then((data) => {
            if (data.results && data.results.length > 0) {
              setSuggestions(data.results.map((p: any) => p.name));
              setShow(true);
            } else {
              setShow(false);
            }
          })
          .catch(() => setShow(false));
      }, 300);
      setDebounceTimer(timer);
    } else {
      setShow(false);
    }
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <form onSubmit={onSubmit} className="relative" ref={containerRef}>
      <div className="flex items-center gap-2 bg-white/95 backdrop-blur rounded-xl shadow-lg p-1 px-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for groceries..."
          className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-gray-800 placeholder:text-gray-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.length >= 2 && suggestions.length > 0 && setShow(true)}
        />
      </div>

      {show && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto">
          {suggestions.map((s, i) => (
            <Link
              key={i}
              href={`/search?q=${encodeURIComponent(s)}`}
              className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-3"
              onClick={() => setShow(false)}
            >
              <Search className="w-4 h-4 text-gray-400" />
              <span>{s}</span>
            </Link>
          ))}
        </div>
      )}
    </form>
  );
}