import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const products = await dbQuery(`
      SELECT p.*, u1.name AS unit_name, u2.name AS secondary_unit
      FROM products p
      LEFT JOIN units u1 ON p.primary_unit_id = u1.id
      LEFT JOIN units u2 ON p.secondary_unit_id = u2.id
      WHERE p.id = ? AND p.visible = 1
    `, [id]);

    if (products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product: products[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}