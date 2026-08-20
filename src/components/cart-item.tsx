'use client';
import { useCart, CartItem } from '@/store/cart';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { imageSrc, formatPrice } from '@/lib/utils';

interface Props {
  item: CartItem;
}

export function CartItemRow({ item }: Props) {
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
        <img src={imageSrc(item.image)} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{item.name}</p>
        {item.unit && <p className="text-xs text-gray-400">{item.unit}</p>}
        <p className="text-green-600 font-bold text-sm">{formatPrice(item.price)}</p>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 rounded-lg border border-green-500 flex items-center justify-center text-green-600 hover:bg-green-50 transition">
          {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
        </button>
        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
