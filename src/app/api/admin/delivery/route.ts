import { NextRequest, NextResponse } from 'next/server'
import { dbQuery, dbInsert, dbExecute } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rules = await dbQuery('SELECT * FROM delivery_charge_rules ORDER BY id DESC')

    return NextResponse.json({ rules })
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
    const { min_amount, max_amount, charge, area } = body

    if (charge === undefined) {
      return NextResponse.json({ error: 'Charge is required' }, { status: 400 })
    }

    const result = await dbInsert(
      'INSERT INTO delivery_charge_rules (min_amount, max_amount, charge, area) VALUES (?, ?, ?, ?)',
      [min_amount || 0, max_amount || null, charge, area || null]
    )

    return NextResponse.json({ success: true, ruleId: result })
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
      return NextResponse.json({ error: 'Rule ID is required' }, { status: 400 })
    }

    await dbExecute('DELETE FROM delivery_charge_rules WHERE id = ?', [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
