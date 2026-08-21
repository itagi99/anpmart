import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const products = await dbQuery(`
      SELECT p.id, p.name, p.price, p.image_path
      FROM products p
      WHERE p.visible = 1 AND p.name LIKE ?
      ORDER BY p.created_at DESC
      LIMIT 10
    `, [`%${q}%`]);

    return NextResponse.json({ results: products });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}