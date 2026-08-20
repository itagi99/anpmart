'use client';
import { useCart } from '@/store/cart';
import { formatPrice, imageSrc } from '@/lib/utils';
import { Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/lib/types';

interface Props {
  id?: number;
  name?: string;
  price?: number;
  mrp?: number;
  image?: string;
  unit?: string;
  product?: Product;
}

export function ProductCard({ id, name, price, mrp, image, unit, product }: Props) {
  const pId = product?.id ?? id ?? 0;
  const pName = product?.name ?? name ?? '';
  const pPrice = product?.price ?? price ?? 0;
  const pMrp = product?.mrp ?? mrp;
  const pImage = product?.image_path ?? image ?? '';
  const pUnit = product?.unit_name ?? unit;

  const addItem = useCart((s) => s.addItem);
  const items = useCart((s) => s.items);
  const cartItem = items.find((i) => i.productId === pId);
  const qty = cartItem?.quantity || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
      <Link href={`/product/${pId}`}>
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <img src={imageSrc(pImage)} alt={pName} className="w-full h-full object-cover" loading="lazy" />
          {pMrp && pMrp > pPrice && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {Math.round((1 - pPrice / pMrp) * 100)}% OFF
            </span>
          )}
        </div>
      </Link>
      <div className="p-2.5 flex-1 flex flex-col">
        <Link href={`/product/${pId}`}>
          <h3 className="text-xs font-semibold line-clamp-2 min-h-[32px] hover:text-green-600 transition">{pName}</h3>
        </Link>
        {pUnit && <p className="text-[10px] text-gray-400 mt-0.5">{pUnit}</p>}
        <div className="mt-auto pt-1.5">
          <p className="text-sm font-bold">{formatPrice(pPrice)}</p>
          {pMrp && pMrp > pPrice && (
            <p className="text-[10px] text-gray-400 line-through">{formatPrice(pMrp)}</p>
          )}
          <div className="mt-1.5">
            {qty === 0 ? (
              <button
                onClick={() => addItem({ productId: pId, name: pName, price: pPrice, image: pImage, unit: pUnit }, 1)}
                className="w-full py-1.5 text-xs font-bold text-green-600 border border-green-500 rounded-lg hover:bg-green-50 transition"
              >
                ADD
              </button>
            ) : (
              <div className="flex items-center justify-center gap-0 border border-green-500 rounded-lg overflow-hidden">
                <button onClick={() => useCart.getState().updateQuantity(pId, qty - 1)} className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-50 transition text-sm font-bold">
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-xs font-bold">{qty}</span>
                <button onClick={() => useCart.getState().updateQuantity(pId, qty + 1)} className="w-8 h-8 flex items-center justify-center bg-green-500 text-white hover:bg-green-600 transition text-sm font-bold">
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
