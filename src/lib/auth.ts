import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'anpmart-super-secret-jwt-key-2026-change-me');
const COOKIE_NAME = 'anpmart_session';

export interface Session {
  userId: number;
  role: 'customer' | 'admin' | 'salesman' | 'supervisor' | 'deliveryman';
  name: string;
}

export async function createSession(session: Session): Promise<string> {
  const token = await new SignJWT(session as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
  return token;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string) {
  return {
    'Set-Cookie': `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
  };
}

export function clearSessionCookie() {
  return {
    'Set-Cookie': `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  };
}