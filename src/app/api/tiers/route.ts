import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productIds } = body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ tiersMap: {} });
    }

    const placeholders = productIds.map(() => '?').join(',');
    const tiers = await dbQuery(`
      SELECT product_id, min_quantity as min_qty, discount_type as type, discount_value as value
      FROM product_tier_pricing
      WHERE product_id IN (${placeholders})
      ORDER BY product_id, min_quantity ASC
    `, productIds);

    const tiersMap: Record<number, any[]> = {};
    for (const t of tiers) {
      const pid = t.product_id;
      if (!tiersMap[pid]) tiersMap[pid] = [];
      tiersMap[pid].push({
        min_qty: t.min_qty,
        type: t.type,
        value: t.value
      });
    }

    return NextResponse.json({ tiersMap });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tiers' }, { status: 500 });
  }
}