import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tiers = await dbQuery(`
      SELECT min_quantity as min_qty, discount_type as type, discount_value as value
      FROM product_tier_pricing
      WHERE product_id = ?
      ORDER BY min_quantity ASC
    `, [id]);
    return NextResponse.json({ tiers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tiers' }, { status: 500 });
  }
}