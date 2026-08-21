'use client';
import { useState, useEffect } from 'react';
import { X, Minus, Plus, Tag, Trash2 } from 'lucide-react';
import { useCart } from '@/store/cart';
import { imageSrc, formatPrice, getUnitConversion } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  flashDeal?: any;
}

export default function ProductModal({ isOpen, onClose, product, flashDeal }: Props) {
  const { addItem, updateQuantity, removeItem, getItem } = useCart();
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

  useEffect(() => {
    if (isOpen) {
      setQuantity(inCart > 0 ? inCart : 1);
      calcAuto();
    }
  }, [isOpen, inCart]);

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

  const handleSave = () => {
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
    onClose();
  };

  const handleRemove = () => {
    removeItem(product.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50" onClick={onClose}>
      <div
        className="w-full bg-white rounded-t-2xl shadow-xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold">{product.name}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 relative">
            <img
              src={imageSrc(product.image_path)}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
            {(flashDeal && !oos) && (
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

          {product.tiers?.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
              <div className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Bulk Offers Available
              </div>
              <div className="space-y-1">
                {product.tiers.map((t: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm font-bold text-amber-700 border-b border-amber-200/50 pb-1 last:border-0">
                    <span>Buy {t.min_qty} or more</span>
                    <span>{t.discount_type === 'amount' ? `₹${t.value} OFF` : `${t.value}% OFF`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                <Minus className="w-5 h-5" />
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
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {inCart > 0 && (
            <button
              onClick={handleRemove}
              className="w-full py-3 text-red-500 font-bold border border-red-300 rounded-lg hover:bg-red-50 transition mb-2"
            >
              Remove from Cart
            </button>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b-2xl sticky bottom-0">
          <button
            onClick={handleSave}
            disabled={oos}
            className="w-full py-4 rounded-xl font-black text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: oos ? '#e5e7eb' : '#0c831f', color: oos ? '#9ca3af' : 'white' }}
          >
            {oos ? 'OUT OF STOCK' : inCart > 0 ? `UPDATE CART (${quantity})` : 'ADD TO CART'}
          </button>
        </div>
      </div>
    </div>
  );
}