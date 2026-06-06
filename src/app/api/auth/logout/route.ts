import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import { successResponse } from '@/utils/api';

export async function POST(request: NextRequest) {
  const response = NextResponse.json(successResponse(null, 'Logged out successfully'));
  clearAuthCookie(response);
  return response;
}
