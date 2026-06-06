import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import type { User } from '../store/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key_123';
const COOKIE_NAME = 'auth-token';

export function setAuthCookie(res: NextResponse, token: string) {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export function clearAuthCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
}

export function verifyToken(token: string): { valid: boolean; payload?: any; error?: string } {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err?.message };
  }
}

export function generateToken(user: any) {
  const userId = user.id || user._id?.toString();
  const payload = {
    sub: userId,
    userId: userId,
    phone: user.phone,
    name: user.name,
    role: user.accountType || user.role,
    accountType: user.accountType || user.role,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  return token;
}

