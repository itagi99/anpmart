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

  const isFlash = flashDeal !== null;
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
      tiers: [],
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
      <div className="group bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col h-full hover:shadow-md hover:border-emerald-200 transition-all duration-200">
        <div className="relative aspect-[0.85] bg-gray-50 overflow-hidden">
          <img
            src={imageSrc(product.image_path)}
            alt={product.name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {(badgeText || isFlash) && !oos && (
            <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-black ${isFlash ? 'bg-red-500 text-white' : 'bg-red-500 text-white'}`}>
              {badgeText}
            </div>
          )}
          {oos && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">OUT OF STOCK</span>
            </div>
          )}
        </div>

        <div className="p-2.5 flex-1 flex flex-col">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-xs font-black text-gray-900 line-clamp-2 min-h-[2.8rem] mb-1 group-hover:text-emerald-600 transition">{product.name}</h3>
          </Link>
          {unitText && <p className="text-[10px] font-bold text-gray-500 mb-1">{unitText}</p>}
          {product.tiers?.length && (
            <div className="mb-1.5">
              <Tag className="w-3 h-3 text-amber-500 mr-1 inline" />
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Bulk Offers</span>
            </div>
          )}

          <div className="mt-auto pt-1">
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-sm font-black text-gray-900">{formatPrice(displayPrice)}</span>
              {hasDisc && <span className="text-[10px] text-gray-400 line-through">{formatPrice(mrp)}</span>}
            </div>

            <div className="flex items-center justify-between">
              {inCart ? (
                <div className="flex items-center gap-0 border border-emerald-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleChange(-1); }}
                    className="w-8 h-8 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
<input
                      type="number"
                      value={quantity}
                      onChange={handleInputChange}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    className="w-10 text-center text-sm font-black text-emerald-700 bg-transparent border-none outline-none -moz-appearance-none"
                    min="1"
                  />
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleChange(1); }}
                    className="w-8 h-8 flex items-center justify-center bg-emerald-500 text-white hover:bg-emerald-600 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(); }}
                  className="w-full py-2 text-xs font-black text-emerald-600 border border-emerald-400 rounded-lg hover:bg-emerald-50 transition"
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