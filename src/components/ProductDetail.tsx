'use client';
import { useState } from 'react';
import { useCart } from '@/store/cart';
import { formatPrice, imageSrc } from '@/lib/utils';
import { ChevronLeft, Minus, Plus, Tag } from 'lucide-react';
import Link from 'next/link';

interface Props {
  product: any;
  flashDeal: any;
}

export default function ProductDetail({ product, flashDeal }: Props) {
  const { addItem, updateQuantity, getItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [autoCalc, setAutoCalc] = useState('');

  const inCart = getItem(product.id)?.quantity || 0;
  const isFlash = flashDeal !== null;
  const displayPrice = isFlash ? flashDeal.flash_price : (product.price > 0 ? product.price : product.mrp);
  const mrp = Number(product.mrp || 0);
  const hasDisc = isFlash ? mrp > displayPrice && displayPrice > 0 : (product.price > 0 && mrp > product.price);
  const oos = Number(product.stock || 0) <= 0;

  const unitConversion = Number(product.unit_conversion || 1);
  const primaryUnit = product.primary_unit || '';
  const secondaryUnit = product.secondary_unit || '';

  const calcAuto = () => {
    if (unitConversion > 1 && quantity > 0) {
      const totalSec = quantity * unitConversion;
      const totalPrice = quantity * displayPrice;
      const formattedSec = Number.isInteger(unitConversion * quantity) 
        ? (unitConversion * quantity).toFixed(0) 
        : (unitConversion * quantity).toFixed(2);
      setAutoCalc(`Total: ${formattedSec} ${secondaryUnit} (₹${totalPrice.toFixed(2)})`);
    } else {
      setAutoCalc('');
    }
  };

  const handleChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty < 1) return;
    setQuantity(newQty);
    calcAuto();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 1;
    setQuantity(val);
    calcAuto();
  };

  const handleAdd = () => {
    const { addItem, updateQuantity, getItem } = useCart.getState();
    if (inCart > 0) {
      updateQuantity(product.id, quantity);
    } else {
      addItem({
        productId: product.id,
        name: product.name,
        price: displayPrice,
        image: product.image_path,
        unit: product.unit_name || secondaryUnit,
        unitConversion,
        secondaryUnit,
        mrp,
        hasDisc,
        tiers: product.tiers || [],
      }, quantity);
    }
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/categories" className="p-1">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        </Link>
        <h1 className="text-lg font-black text-gray-900 flex-1">{product.name}</h1>
      </div>

      <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden">
        <img
          src={imageSrc(product.image_path)}
          alt={product.name}
          className="w-full h-full object-contain p-4"
        />
        {isFlash && !oos && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            ⚡ FLASH
          </div>
        )}
        {oos && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-red-500 font-bold">
            OUT OF STOCK
          </div>
        )}
      </div>

      <h2 className="text-xl font-black text-gray-900 mb-1">{product.name}</h2>
      <p className="text-sm font-semibold text-gray-500 mb-4">
        {unitConversion > 1 && primaryUnit && secondaryUnit
          ? `1 ${primaryUnit} = ${Number.isInteger(unitConversion) ? unitConversion : unitConversion.toFixed(2)} ${secondaryUnit}`
          : secondaryUnit}
      </p>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-black text-gray-900">{formatPrice(displayPrice)}</span>
        {hasDisc && <span className="text-lg text-gray-400 line-through">{formatPrice(mrp)}</span>}
      </div>

      {autoCalc && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 text-emerald-700 font-bold text-sm">
          {autoCalc}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">Quantity</span>
        <div className="flex items-center gap-0 border border-emerald-300 rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => handleChange(-1)}
            className="w-12 h-12 flex items-center justify-center text-emerald-600 hover:bg-emerald-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/></svg>
          </button>
          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            onClick={(e) => (e.target as HTMLInputElement).select()}
            className="w-20 text-center text-lg font-black text-emerald-700 bg-transparent border-none outline-none"
            min="1"
          />
          <button
            onClick={() => handleChange(1)}
            className="w-12 h-12 flex items-center justify-center bg-emerald-500 text-white hover:bg-emerald-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={oos}
        className="w-full py-4 rounded-xl font-black text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: oos ? '#e5e7eb' : '#0c831f', color: oos ? '#9ca3af' : 'white' }}
      >
        {oos ? 'OUT OF STOCK' : 'ADD TO CART'}
      </button>
    </div>
  );
}