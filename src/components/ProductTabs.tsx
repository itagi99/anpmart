'use client';
import { useState } from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface Tab {
  key: string;
  label: string;
  products: Product[];
}

interface Props {
  tabs: Tab[];
}

export default function ProductTabs({ tabs }: Props) {
  const [active, setActive] = useState(tabs[0]?.key ?? '');
  const activeTab = tabs.find(t => t.key === active) ?? tabs[0];

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide mb-4">
        {tabs.map((tab) => {
          const selected = tab.key === active;
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${
                selected
                  ? 'bg-emerald-500 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab?.products.length ? (
        <div className="grid grid-cols-3 gap-3 px-4">
          {activeTab.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-8 px-4">No products in this section yet.</p>
      )}
    </div>
  );
}