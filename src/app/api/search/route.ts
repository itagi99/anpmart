import { NextRequest, NextResponse } from 'next/server'
import { dbQuery } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    if (!q) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
    }

    const products = await dbQuery(
      'SELECT * FROM products WHERE name LIKE ? AND visible = 1 LIMIT 20',
      [`%${q}%`]
    )

    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
