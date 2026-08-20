import { NextRequest, NextResponse } from 'next/server'
import { dbQuery } from '@/lib/db'
import { createSession, setSessionCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const users = await dbQuery('SELECT * FROM users WHERE email = ? OR phone = ?', [email, email])

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const user = users[0]

    const isAdmin = user.role === 'admin' || user.username === 'admin'

    if (isAdmin) {
      if (password !== process.env.ADMIN_DEFAULT_PASSWORD && password !== user.password_hash) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
    } else {
      if (password !== user.password_hash) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
    }

    const token = await createSession({ userId: user.id, role: user.role, name: user.name || user.username })
    const response = NextResponse.json({ success: true, role: user.role })
    const cookieHeaders = setSessionCookie(token)
    response.headers.set('Set-Cookie', cookieHeaders['Set-Cookie'])

    return response
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
