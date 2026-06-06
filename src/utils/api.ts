import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  statusCode: number
}

export interface ApiError {
  message: string
  statusCode: number
  details?: any
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function successResponse<T>(
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    statusCode,
  }
}

export function errorResponse(
  message: string,
  statusCode: number = 400,
  error?: any
): ApiResponse {
  return {
    success: false,
    message,
    error: error?.message || error,
    statusCode,
  }
}

export function handleApiError(error: any, defaultStatusCode: number = 500) {
  console.error('API Error:', error)

  if (error instanceof AppError) {
    return NextResponse.json(
      errorResponse(error.message, error.statusCode, error.details),
      { status: error.statusCode }
    )
  }

  if (error.name === 'ValidationError') {
    return NextResponse.json(
      errorResponse('Validation failed', 422, error.message),
      { status: 422 }
    )
  }

  if (error.name === 'MongoError' || error.name === 'MongoServerError') {
    return NextResponse.json(
      errorResponse('Database error', 500, error.message),
      { status: 500 }
    )
  }

  return NextResponse.json(
    errorResponse('Internal server error', defaultStatusCode, error?.message),
    { status: defaultStatusCode }
  )
}

export async function validateRequest<T>(
  data: any,
  schema: any
): Promise<{ valid: boolean; errors?: any; data?: T }> {
  try {
    const validated = await schema.parseAsync(data)
    return { valid: true, data: validated }
  } catch (error: any) {
    return {
      valid: false,
      errors: error.errors || error.message,
    }
  }
}

export function getAuthUserId(request: NextRequest): string {
  // 1. Try reading the forwarded header set by the middleware
  const headerUserId = request.headers.get('x-user-id')
  if (headerUserId) return headerUserId

  // 2. Fallback to cookie or auth header
  let token = request.cookies.get('auth-token')?.value
  if (!token) {
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7)
    }
  }

  if (!token) {
    throw new AppError(401, 'Unauthorized: Missing token')
  }

  const { valid, payload } = verifyToken(token)
  if (!valid || !payload) {
    throw new AppError(401, 'Unauthorized: Invalid token')
  }

  const userId = payload.userId || payload.sub
  if (!userId) {
    throw new AppError(401, 'Unauthorized: Invalid token payload structure')
  }

  return userId
}

