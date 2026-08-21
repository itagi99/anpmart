import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET() {
  try {
    const flashDeals = await dbQuery(`
      SELECT p.*, u1.name AS unit_name, u2.name AS secondary_unit
      FROM products p
      LEFT JOIN units u1 ON p.primary_unit_id = u1.id
      LEFT JOIN units u2 ON p.secondary_unit_id = u2.id
      WHERE p.visible = 1 
        AND p.is_deal_of_day = 1
        AND (p.deal_start IS NULL OR p.deal_start <= datetime('now'))
        AND (p.deal_end IS NULL OR p.deal_end >= datetime('now'))
      ORDER BY p.updated_at DESC
      LIMIT 20
    `);
    return NextResponse.json({ deals: flashDeals });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch flash deals' }, { status: 500 });
  }
}