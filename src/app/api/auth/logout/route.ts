import { NextRequest, NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.redirect(new URL('/', request.url))
    const cookieHeaders = clearSessionCookie()
    response.headers.set('Set-Cookie', cookieHeaders['Set-Cookie'])
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
