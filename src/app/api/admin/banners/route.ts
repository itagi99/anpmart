import { NextRequest, NextResponse } from 'next/server'
import { dbQuery, dbInsert, dbExecute } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const banners = await dbQuery('SELECT * FROM banners ORDER BY id DESC')

    return NextResponse.json({ banners })
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
    const { title, image_url, link_url, active } = body

    if (!title || !image_url) {
      return NextResponse.json({ error: 'Title and image URL are required' }, { status: 400 })
    }

    const result = await dbInsert(
      'INSERT INTO banners (title, image_url, link_url, active) VALUES (?, ?, ?, ?)',
      [title, image_url, link_url || null, active !== undefined ? active : 1]
    )

    return NextResponse.json({ success: true, bannerId: result })
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
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 })
    }

    await dbExecute('DELETE FROM banners WHERE id = ?', [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
