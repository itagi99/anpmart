import { dbQuery } from '@/lib/db';
import { Product, Category, Banner } from '@/types';
import { imageSrc } from '@/lib/utils';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import CategoryScroll from '@/components/CategoryScroll';
import BannerCarousel from '@/components/BannerCarousel';
import FlashDealsTicker from '@/components/FlashDealsTicker';
import ProductTabs from '@/components/ProductTabs';
import ProductCard from '@/components/ProductCard';
import { Flame, Trophy, Star, ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getCategories(): Promise<Category[]> {
  return dbQuery("SELECT * FROM categories ORDER BY name ASC");
}

async function getProducts(): Promise<Product[]> {
  return dbQuery(`
    SELECT p.*, u1.name AS unit_name, u2.name AS secondary_unit
    FROM products p
    LEFT JOIN units u1 ON p.primary_unit_id = u1.id
    LEFT JOIN units u2 ON p.secondary_unit_id = u2.id
    WHERE p.visible = 1
    ORDER BY p.created_at DESC
  `);
}

async function getBanners(): Promise<Banner[]> {
  return dbQuery("SELECT * FROM banners WHERE active = 1 ORDER BY created_at DESC LIMIT 10");
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

export default async function HomePage() {
  const [categories, products, banners, flashDeals] = await Promise.all([
    getCategories(),
    getProducts(),
    getBanners(),
    getFlashDeals(),
  ]);

  const dealOfDay = products.filter(p => p.is_deal_of_day === 1);
  const bestSellers = products.filter(p => p.is_best_seller === 1);
  const productOfWeek = products.filter(p => p.is_product_of_week === 1);
  const mustBuy = products.filter(p => p.is_must_buy === 1);
  const allProducts = products.slice(0, 30);

  return (
    <html lang="en">
      <head>
        <title>ANP MART</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0c831f" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon2.png" />
        <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-gray-50 pb-20 font-mulish">
        <Header />

        <main className="container-fluid p-0">
          <FlashDealsTicker />

          <BannerCarousel banners={banners} />

          <CategoryScroll categories={categories} />

          <ProductTabs
            tabs={[
              { key: 'all', label: 'All Products', products: allProducts },
              { key: 'deal', label: '⚡ Flash Deals', products: products.filter(p => p.is_deal_of_day === 1) },
              { key: 'day', label: '🌟 Deal of the Day', products: products.filter(p => p.is_deal_of_day === 1) },
              { key: 'best', label: '🔥 Best Sellers', products: products.filter(p => p.is_best_seller === 1) },
              { key: 'week', label: '📅 Product of the Week', products: products.filter(p => p.is_product_of_week === 1) },
              { key: 'must', label: '✅ Must Buy', products: products.filter(p => p.is_must_buy === 1) },
            ]}
          />
        </main>

        <BottomNav />
      </body>
    </html>
  );
}