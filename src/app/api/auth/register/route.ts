import { NextRequest, NextResponse } from 'next/server'
import { dbInsert } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    const existingUsers = await dbInsert('SELECT id FROM users WHERE email = ?', [email])
    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const result = await dbInsert(
      'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, password, 'user']
    )

    return NextResponse.json({ success: true, userId: result?.lastInsertRowid })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
