import { NextRequest, NextResponse } from 'next/server'
import { dbQuery, dbInsert, dbExecute } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const coupons = await dbQuery('SELECT * FROM coupons ORDER BY id DESC')

    return NextResponse.json({ coupons })
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
    const { code, discount_type, discount_value, min_order, max_uses, expires_at, active } = body

    if (!code || discount_value === undefined) {
      return NextResponse.json({ error: 'Code and discount value are required' }, { status: 400 })
    }

    const result = await dbInsert(
      `INSERT INTO coupons (code, discount_type, discount_value, min_order, max_uses, expires_at, active) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [code, discount_type || 'fixed', discount_value, min_order || 0, max_uses || null, expires_at || null, active !== undefined ? active : 1]
    )

    return NextResponse.json({ success: true, couponId: result })
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
      return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 })
    }

    await dbExecute('DELETE FROM coupons WHERE id = ?', [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
