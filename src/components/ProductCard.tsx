'use client';
import { useState } from 'react';
import { useCart } from '@/store/cart';
import { imageSrc, formatPrice, discountBadgeText, getUnitConversion } from '@/lib/utils';
import { Minus, Plus, Trash2, Tag } from 'lucide-react';
import Link from 'next/link';

interface Props {
  product: any;
  flashDeal?: any;
}

export default function ProductCard({ product, flashDeal }: Props) {
  const { addItem, updateQuantity, removeItem, getItem } = useCart();
  const [quantity, setQuantity] = useState(() => getItem(product.id)?.quantity || 0);
  const inCart = quantity > 0;

  const isFlash = !!flashDeal;
  const displayPrice = isFlash ? flashDeal.flash_price : (product.price > 0 ? product.price : product.mrp);
  const mrp = Number(product.mrp || 0);
  const hasDisc = isFlash ? mrp > displayPrice && displayPrice > 0 : (product.price > 0 && mrp > product.price);
  const badgeText = isFlash ? '⚡ FLASH' : discountBadgeText(product);
  const oos = Number(product.stock || 0) <= 0;

  const unitConversion = Number(product.unit_conversion || 1);
  const primaryUnit = product.primary_unit || '';
  const secondaryUnit = product.secondary_unit || '';
  const unitText = unitConversion > 1 && primaryUnit && secondaryUnit
    ? `1 ${primaryUnit} = ${Number.isInteger(unitConversion) ? unitConversion : unitConversion.toFixed(2)} ${secondaryUnit}`
    : secondaryUnit;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: displayPrice,
      image: product.image_path,
      unit: unitText,
      unitConversion,
      secondaryUnit,
      mrp,
      hasDisc,
      tiers: product.tiers || [],
    }, 1);
    setQuantity(1);
  };

  const handleChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty <= 0) {
      removeItem(product.id);
      setQuantity(0);
    } else {
      updateQuantity(product.id, newQty);
      setQuantity(newQty);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    if (val <= 0) {
      removeItem(product.id);
      setQuantity(0);
    } else {
      updateQuantity(product.id, val);
      setQuantity(val);
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="block">
      <div className="group bg-white border border-gray-100 rounded-lg overflow-hidden flex flex-col h-full hover:shadow-sm hover:border-emerald-200 transition-all duration-150" style={{ minWidth: '100px', maxWidth: '100px' }}>
        <div className="relative aspect-[0.85] bg-gray-50 overflow-hidden">
          <img
            src={imageSrc(product.image_path)}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          {(badgeText || isFlash) && !oos && (
            <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-black ${isFlash ? 'bg-red-500 text-white' : 'bg-red-500 text-white'}`}>
              {badgeText}
            </div>
          )}
          {oos && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">OOS</span>
            </div>
          )}
        </div>

        <div className="p-1.5 flex-1 flex flex-col">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-[10px] font-black text-gray-900 line-clamp-2 min-h-[2.4rem] mb-0.5 group-hover:text-emerald-600 transition">{product.name}</h3>
          </Link>
          {unitText && <p className="text-[9px] font-bold text-gray-500 mb-0.5">{unitText}</p>}
          {product.tiers?.length && (
            <div className="mb-1">
              <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Bulk</span>
            </div>
          )}

          <div className="mt-auto pt-0.5">
            <div className="flex items-baseline gap-0.5 mb-0.5">
              <span className="text-sm font-black text-gray-900">{formatPrice(displayPrice)}</span>
              {hasDisc && <span className="text-[9px] text-gray-400 line-through">{formatPrice(mrp)}</span>}
            </div>

            <div className="flex items-center justify-between">
              {inCart ? (
                <div className="flex items-center gap-0 border border-emerald-300 rounded-lg overflow-hidden bg-white" style={{ height: '22px' }}>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleChange(-1); }}
                    className="w-7 h-7 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/></svg>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleInputChange}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    className="w-8 text-center text-[10px] font-black text-emerald-700 bg-transparent border-none outline-none -moz-appearance-none"
                    min="1"
                  />
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleChange(1); }}
                    className="w-7 h-7 flex items-center justify-center bg-emerald-500 text-white hover:bg-emerald-600 transition"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(); }}
                  className="w-full py-1.5 text-[10px] font-black text-emerald-600 border border-emerald-400 rounded-lg hover:bg-emerald-50 transition"
                >
                  ADD
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}