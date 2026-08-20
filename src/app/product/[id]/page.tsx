import { dbQuery } from '@/lib/db';
import { Product } from '@/lib/types';
import { imageSrc, formatPrice } from '@/lib/utils';
import Header from '@/components/header';
import BottomNav from '@/components/bottom-nav';
import AddToCartButton from './add-to-cart-button';
import { ChevronLeft, Star, BadgePercent } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getProduct(id: string): Promise<Product | null> {
  const rows = await dbQuery<Product[]>(
    `SELECT p.id, p.name, p.price, p.mrp, p.image_path, p.brand, p.description,
     p.is_best_seller, p.is_product_of_week, p.is_must_buy, p.is_deal_of_day,
     p.visible, p.category_id, u1.name AS unit_name
     FROM products p
     LEFT JOIN units u1 ON p.primary_unit_id = u1.id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0] || null;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-500 text-lg">Product not found</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const discount = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <a href="/" className="p-1">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </a>
          <h1 className="text-lg font-bold text-gray-900 truncate">{product.name}</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative">
            <img
              src={imageSrc(product.image_path)}
              alt={product.name}
              className="w-full h-72 object-contain bg-gray-50"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <BadgePercent className="w-3 h-3" />
                {discount}% OFF
              </span>
            )}
          </div>

          <div className="p-4 space-y-3">
            {product.brand && (
              <p className="text-sm text-emerald-600 font-medium">{product.brand}</p>
            )}
            <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.mrp)}</span>
              )}
            </div>

            {product.unit_name && (
              <p className="text-sm text-gray-500">Unit: {product.unit_name}</p>
            )}

            {product.description && (
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              {product.is_best_seller === 1 && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" /> Best Seller
                </span>
              )}
              {product.is_deal_of_day === 1 && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Deal of Day</span>
              )}
              {product.is_product_of_week === 1 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Product of Week</span>
              )}
              {product.is_must_buy === 1 && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Must Buy</span>
              )}
            </div>

            <AddToCartButton product={product} />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
