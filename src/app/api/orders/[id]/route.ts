import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Order, OrderStatus } from '@/models/Order'
import { Notification } from '@/models/Notification'
import { successResponse, errorResponse, AppError } from '@/utils/api'
import { verifyToken } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

function getUserInfo(request: NextRequest) {
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

  return {
    userId: payload.userId || payload.sub,
    role: payload.role || payload.accountType || 'customer',
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB()
    const { userId, role } = getUserInfo(request)
    const { id } = await params

    const order = await Order.findById(id).populate('userId', 'name phone email')
    if (!order) {
      throw new AppError(404, 'Order not found')
    }

    // Authorization: Customer can only view their own order
    if (role === 'customer' && order.userId._id.toString() !== userId) {
      throw new AppError(403, 'Forbidden: You do not have access to this order')
    }

    return NextResponse.json(successResponse(order, 'Order retrieved successfully'))
  } catch (error) {
    console.error('Get Order Error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(errorResponse(error.message, error.statusCode), {
        status: error.statusCode,
      })
    }
    return NextResponse.json(errorResponse('Failed to retrieve order', 500), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB()
    const { userId, role } = getUserInfo(request)
    const { id } = await params
    const body = await request.json()

    const order = await Order.findById(id)
    if (!order) {
      throw new AppError(404, 'Order not found')
    }

    // Authorization check: Agents and Admins can update status. Customers can only cancel when pending.
    const { status, agentId, paymentStatus } = body

    if (role === 'customer') {
      if (status && status !== 'cancelled') {
        throw new AppError(403, 'Forbidden: Customers can only cancel orders')
      }
      if (order.status !== 'pending' && status === 'cancelled') {
        throw new AppError(400, 'Cannot cancel order once it is processed')
      }
    }

    const previousStatus = order.status

    if (status && status !== previousStatus) {
      order.status = status as OrderStatus
      order.timeline.push({
        status: status as OrderStatus,
        timestamp: new Date(),
      })

      // Add to Order embedded notifications & separate Notification collection
      const msg = `Order ${order.orderNumber} status updated to ${status.replace('_', ' ')}`
      order.notifications.push({
        userId: order.userId.toString(),
        message: msg,
        type: 'order',
        createdAt: new Date(),
      })

      const notif = new Notification({
        userId: order.userId,
        title: `Order Update: ${status.replace('_', ' ').toUpperCase()}`,
        message: msg,
        type: 'order',
      })
      await notif.save()
    }

    if (agentId !== undefined) {
      order.agentId = agentId ? agentId : undefined
    }

    if (paymentStatus !== undefined) {
      order.payment.status = paymentStatus
    }

    await order.save()

    return NextResponse.json(successResponse(order, 'Order updated successfully'))
  } catch (error) {
    console.error('Update Order Error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(errorResponse(error.message, error.statusCode), {
        status: error.statusCode,
      })
    }
    return NextResponse.json(errorResponse('Failed to update order', 500), { status: 500 })
  }
}
