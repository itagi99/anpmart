import { NextRequest, NextResponse } from 'next/server'
import { dbQuery, dbInsert, dbExecute } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const products = await dbQuery(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       ORDER BY p.id DESC`
    )

    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, stock, category_id, image_url, visible, unit_id } = body

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
    }

    const result = await dbInsert(
      `INSERT INTO products (name, description, price, stock, category_id, image_url, visible, unit_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description || null, price, stock || 0, category_id || null, image_url || null, visible !== undefined ? visible : 1, unit_id || null]
    )

    return NextResponse.json({ success: true, productId: result })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    await dbExecute('DELETE FROM products WHERE id = ?', [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
