import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Order } from '@/models/Order'
import { Pricing } from '@/models/Pricing'
import { successResponse, errorResponse, AppError } from '@/utils/api'
import * as z from 'zod'
import jwt from 'jsonwebtoken'

const createOrderSchema = z.object({
  clothes: z.array(
    z.object({
      category: z.string(),
      quantity: z.number(),
      service: z.enum(['wash', 'wash_iron', 'dry_clean', 'premium']),
      price: z.number(),
    })
  ),
  pickupDate: z.string(),
  deliveryDate: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  paymentMethod: z.enum(['razorpay', 'cod']),
})

function getAuthUserId(request: NextRequest): string {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Unauthorized')
  }

  const token = authHeader.slice(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded.userId
  } catch {
    throw new AppError(401, 'Invalid token')
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const userId = getAuthUserId(request)
    const body = await request.json()
    const validation = createOrderSchema.safeParse(body)

    if (!validation.success) {
      throw new AppError(400, 'Invalid request', validation.error.errors)
    }

    const { clothes, pickupDate, deliveryDate, address, latitude, longitude, paymentMethod } =
      validation.data

    // Generate order number
    const orderNumber = `ORD${Date.now()}`

    // Calculate pricing
    let subtotal = 0
    clothes.forEach((item) => {
      subtotal += item.price * item.quantity
    })

    const tax = Math.round(subtotal * 0.05)
    const deliveryFee = 50
    const total = subtotal + tax + deliveryFee

    // Create order
    const order = new Order({
      orderNumber,
      userId,
      customerId: userId,
      clothes,
      pickupDetails: {
        address,
        latitude,
        longitude,
        scheduledDate: new Date(pickupDate),
        timeSlot: '9:00 AM - 12:00 PM', // TODO: Get from form
      },
      deliveryDetails: {
        address,
        latitude,
        longitude,
        estimatedDate: new Date(deliveryDate),
        timeSlot: '6:00 PM - 9:00 PM', // TODO: Get from form
      },
      status: 'pending',
      pricing: {
        subtotal,
        tax,
        discount: 0,
        deliveryFee,
        total,
      },
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'pending',
      },
      timeline: [
        {
          status: 'pending',
          timestamp: new Date(),
        },
      ],
    })

    await order.save()

    return NextResponse.json(
      successResponse(
        {
          orderId: order._id,
          orderNumber: order.orderNumber,
          total: order.pricing.total,
        },
        'Order created successfully'
      )
    )
  } catch (error) {
    console.error('Order Creation Error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(
        errorResponse(error.message, error.statusCode),
        { status: error.statusCode }
      )
    }
    return NextResponse.json(
      errorResponse('Failed to create order', 500),
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userId = getAuthUserId(request)

    const orders = await Order.find({ userId }).sort({ createdAt: -1 })

    return NextResponse.json(successResponse(orders, 'Orders retrieved'))
  } catch (error) {
    console.error('Get Orders Error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(
        errorResponse(error.message, error.statusCode),
        { status: error.statusCode }
      )
    }
    return NextResponse.json(
      errorResponse('Failed to retrieve orders', 500),
      { status: 500 }
    )
  }
}
