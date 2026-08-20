'use client';

import { useCart } from '@/store/cart';
import { Product } from '@/lib/types';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, items, updateQuantity, removeItem } = useCart();
  const [added, setAdded] = useState(false);

  const cartItem = items.find((i) => i.productId === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image_path,
      unit: product.unit_name,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (quantity > 0) {
    return (
      <div className="flex items-center justify-between bg-emerald-50 rounded-xl p-3 mt-2">
        <button
          onClick={() => quantity === 1 ? removeItem(product.id) : updateQuantity(product.id, quantity - 1)}
          className="w-10 h-10 rounded-full bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-lg font-bold text-emerald-700">{quantity}</span>
        <button
          onClick={() => updateQuantity(product.id, quantity + 1)}
          className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-600 transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full mt-2 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition ${
        added ? 'bg-emerald-600' : 'bg-emerald-500 hover:bg-emerald-600'
      }`}
    >
      <ShoppingCart className="w-5 h-5" />
      {added ? 'Added!' : 'Add to Cart'}
    </button>
  );
}
