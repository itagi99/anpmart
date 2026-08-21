'use client';
import Link from 'next/link';
import { ShoppingCart, Globe } from 'lucide-react';
import { imageSrc } from '@/lib/utils';

interface Props {
  categories: any[];
  selectedId?: number | null;
  onSelect?: (id: number) => void;
}

export default function CategoryScroll({ categories, selectedId, onSelect }: Props) {
  const handleClick = (id: number) => {
    if (onSelect) onSelect(id);
    else window.location.href = `/category/${id}`;
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide">
      <button
        onClick={() => handleClick(0)}
        className={`flex flex-col items-center min-w-[70px] ${selectedId === 0 || selectedId === null ? 'text-emerald-600' : 'text-gray-700'}`}
      >
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border-2 border-emerald-300 mb-1">
          <Globe className="w-6 h-6 text-emerald-600" />
        </div>
        <span className="text-[10px] font-bold text-center whitespace-nowrap">All</span>
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleClick(cat.id)}
          className={`flex flex-col items-center min-w-[70px] ${selectedId === cat.id ? 'text-emerald-600' : 'text-gray-700'}`}
        >
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden mb-1 border-2 border-transparent transition-colors">
            {cat.image_path ? (
              <img src={imageSrc(cat.image_path)} alt={cat.name} className="w-full h-full object-cover mix-blend-multiply" />
            ) : (
              <ShoppingCart className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <span className="text-[10px] font-bold text-center text-gray-700 whitespace-nowrap line-clamp-1">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}