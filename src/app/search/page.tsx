'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatPrice, imageSrc } from '@/lib/utils';
import { ArrowLeft, Search, X } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    if (q) {
      setQuery(q);
      searchProducts(q);
    }
  }, []);

  const searchProducts = (q: string) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then(r => r.json())
        .then(data => {
          if (data.results) setResults(data.results);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 300);
    setDebounceTimer(timer);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchProducts(value);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <html lang="en">
      <head>
        <title>Search - ANP MART</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0c831f" />
        <link rel="manifest" href="/manifest.json" />
        <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-gray-50 pb-20 font-mulish">
        <Header />
        <main className="container-fluid p-4 pb-24">
          <form onSubmit={handleSearch} className="relative mb-4">
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur rounded-xl shadow-lg p-1 px-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input
                type="text"
                placeholder="Search for groceries..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-gray-800 placeholder:text-gray-400"
                value={query}
                onChange={handleChange}
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>

          {query && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                {loading ? 'Searching...' : results.length === 0 ? `No results for "${query}"` : `Found ${results.length} results`}
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-2.5 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))
            ) : results.length === 0 ? (
              <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <p className="text-lg font-semibold text-gray-500 mb-2">No products found</p>
                <p className="text-sm text-gray-400">Try a different search term</p>
              </div>
            ) : (
              results.map((p: any) => (
                <Link key={p.id} href={`/product/${p.id}`}>
                  <ProductCard product={p} />
                </Link>
              ))
            )}
          </div>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}