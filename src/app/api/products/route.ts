import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET() {
  try {
    const products = await dbQuery(`
      SELECT p.*, u1.name AS unit_name, u2.name AS secondary_unit
      FROM products p
      LEFT JOIN units u1 ON p.primary_unit_id = u1.id
      LEFT JOIN units u2 ON p.secondary_unit_id = u2.id
      WHERE p.visible = 1
      ORDER BY p.created_at DESC
    `);
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}