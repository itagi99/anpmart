import { NextResponse } from 'next/server';
import { dbQuery, dbInsert } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password required' }, { status: 400 });
    }

    const existing = await dbQuery('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const userId = await dbInsert(
      'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, password, 'customer']
    );

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}