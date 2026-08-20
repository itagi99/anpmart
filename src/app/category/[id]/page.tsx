import { dbQuery } from '@/lib/db';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/product-card';
import Header from '@/components/header';
import BottomNav from '@/components/bottom-nav';
import { ChevronLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getCategory(id: string): Promise<Category | null> {
  const rows = await dbQuery<Category[]>(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  return dbQuery<Product[]>(
    `SELECT p.id, p.name, p.price, p.mrp, p.image_path, p.brand, p.description,
     p.is_best_seller, p.is_product_of_week, p.is_must_buy, p.is_deal_of_day,
     p.visible, p.category_id, u1.name AS unit_name
     FROM products p
     LEFT JOIN units u1 ON p.primary_unit_id = u1.id
     WHERE p.category_id = ? AND p.visible = 1
     ORDER BY p.created_at DESC`,
    [categoryId]
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [category, products] = await Promise.all([
    getCategory(id),
    getProductsByCategory(id),
  ]);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-500 text-lg">Category not found</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <a href="/" className="p-1">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </a>
          <h1 className="text-xl font-bold text-gray-900">{category.name}</h1>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No products in this category</p>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
