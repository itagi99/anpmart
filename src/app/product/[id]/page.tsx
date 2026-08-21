import { dbQuery } from '@/lib/db';
import { Product } from '@/types';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import ProductDetail from '@/components/ProductDetail';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  const rows = await dbQuery(`
    SELECT p.*, u1.name AS unit_name, u2.name AS secondary_unit
    FROM products p
    LEFT JOIN units u1 ON p.primary_unit_id = u1.id
    LEFT JOIN units u2 ON p.secondary_unit_id = u2.id
    WHERE p.id = ? AND p.visible = 1
  `, [id]);
  return rows[0] || null;
}

async function getFlashDeal(id: string): Promise<any | null> {
  const rows = await dbQuery(`
    SELECT p.id, p.price AS flash_price, p.deal_start, p.deal_end
    FROM products p
    WHERE p.id = ? 
      AND p.visible = 1 
      AND p.is_deal_of_day = 1
      AND (p.deal_start IS NULL OR p.deal_start <= datetime('now'))
      AND (p.deal_end IS NULL OR p.deal_end >= datetime('now'))
  `, [id]);
  return rows[0] || null;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, flashDeal] = await Promise.all([
    getProduct(id),
    getFlashDeal(id),
  ]);

  if (!product) notFound();

  return (
    <html lang="en">
      <head>
        <title>{product.name} - ANP MART</title>
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
          <ProductDetail product={product} flashDeal={flashDeal} />
        </main>
        <BottomNav />
      </body>
    </html>
  );
}