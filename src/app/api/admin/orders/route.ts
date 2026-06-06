import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Order } from '@/models/Order'
import { successResponse, errorResponse, AppError } from '@/utils/api'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Auth check (Admin only)
    const token = request.cookies.get('auth-token')?.value
    if (!token) throw new AppError(401, 'Unauthorized')
    const { valid, payload } = verifyToken(token)
    if (!valid || !payload || (payload.role !== 'admin' && payload.accountType !== 'admin')) {
      throw new AppError(403, 'Forbidden: Admin access required')
    }

    const orders = await Order.find()
      .populate('userId', 'name phone email')
      .populate('agentId', 'name phone')
      .sort({ createdAt: -1 })

    return NextResponse.json(successResponse(orders, 'All orders retrieved successfully'))
  } catch (error) {
    console.error('Admin orders GET error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(errorResponse(error.message, error.statusCode), {
        status: error.statusCode,
      })
    }
    return NextResponse.json(errorResponse('Failed to fetch orders', 500), { status: 500 })
  }
}
