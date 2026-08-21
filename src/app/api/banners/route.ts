import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET() {
  try {
    const banners = await dbQuery('SELECT * FROM banners WHERE active = 1 ORDER BY created_at DESC LIMIT 10');
    return NextResponse.json({ banners });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}