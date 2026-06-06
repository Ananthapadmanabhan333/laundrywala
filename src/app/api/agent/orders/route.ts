import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Order } from '@/models/Order'
import { successResponse, errorResponse, AppError } from '@/utils/api'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    let token = request.cookies.get('auth-token')?.value
    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7)
      }
    }

    if (!token) throw new AppError(401, 'Unauthorized')
    const { valid, payload } = verifyToken(token)
    if (!valid || !payload || (payload.role !== 'agent' && payload.role !== 'admin' && payload.accountType !== 'agent' && payload.accountType !== 'admin')) {
      throw new AppError(403, 'Forbidden: Agent access required')
    }

    const agentId = payload.userId || payload.sub

    const orders = await Order.find({
      agentId,
      status: { $nin: ['delivered', 'cancelled'] },
    })
      .populate('userId', 'name phone email')
      .sort({ createdAt: 1 })

    return NextResponse.json(successResponse(orders, 'Agent tasks retrieved successfully'))
  } catch (error) {
    console.error('Agent tasks GET error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(errorResponse(error.message, error.statusCode), {
        status: error.statusCode,
      })
    }
    return NextResponse.json(errorResponse('Failed to fetch agent tasks', 500), { status: 500 })
  }
}
