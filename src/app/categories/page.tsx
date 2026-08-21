import { dbQuery } from '@/lib/db';
import { Category } from '@/types';
import { imageSrc } from '@/lib/utils';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import CategoryScroll from '@/components/CategoryScroll';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

async function getCategories(): Promise<Category[]> {
  return dbQuery("SELECT * FROM categories ORDER BY name ASC");
}

async function getProducts(): Promise<any[]> {
  return dbQuery(`
    SELECT p.*, u1.name AS unit_name, u2.name AS secondary_unit
    FROM products p
    LEFT JOIN units u1 ON p.primary_unit_id = u1.id
    LEFT JOIN units u2 ON p.secondary_unit_id = u2.id
    WHERE p.visible = 1
    ORDER BY p.created_at DESC
  `);
}

async function getFlashDeals(): Promise<Record<number, any>> {
  const deals = await dbQuery(`
    SELECT p.id, p.price AS flash_price, p.deal_start, p.deal_end
    FROM products p
    WHERE p.visible = 1 
      AND p.is_deal_of_day = 1
      AND (p.deal_start IS NULL OR p.deal_start <= datetime('now'))
      AND (p.deal_end IS NULL OR p.deal_end >= datetime('now'))
  `);
  const map: Record<number, any> = {};
  for (const d of deals) {
    map[d.id] = { flash_price: d.flash_price, deal_start: d.deal_start, deal_end: d.deal_end };
  }
  return map;
}

export default async function CategoriesPage() {
  const [categories, products, flashDeals] = await Promise.all([
    getCategories(),
    getProducts(),
    getFlashDeals(),
  ]);

  return (
    <html lang="en">
      <head>
        <title>Categories - ANP MART</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0c831f" />
        <link rel="manifest" href="/manifest.json" />
        <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-gray-50 pb-20 font-mulish">
        <Header />
        <main className="container-fluid p-0">
          <CategoryScroll categories={categories} />
          <div className="px-2">
            <h2 className="text-sm font-black text-gray-900 mb-2">All Products</h2>
            <div className="grid grid-cols-3 gap-2">
              {products.map((p) => <ProductCard key={p.id} product={p} flashDeal={flashDeals[p.id]} />)}
            </div>
          </div>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}