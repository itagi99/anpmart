'use client';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface Props {
  title: string;
  icon?: React.ReactNode;
  products: Product[];
  viewAllLink?: string;
  flashDeals?: Record<number, any>;
}

export default function ProductSection({ title, icon, products, viewAllLink, flashDeals = {} }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="mb-6 px-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-base font-black text-gray-900">{title}</h2>
        </div>
        {viewAllLink && (
          <a href={viewAllLink} className="flex items-center text-sm text-emerald-600 font-bold">
            See All
          </a>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} flashDeal={flashDeals[p.id]} />
        ))}
      </div>
    </section>
  );
}