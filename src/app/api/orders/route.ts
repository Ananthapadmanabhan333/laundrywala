import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Order } from '@/models/Order'
import { Pricing } from '@/models/Pricing'
import { successResponse, errorResponse, AppError, getAuthUserId } from '@/utils/api'
import * as z from 'zod'

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
  pickupTimeSlot: z.string().optional(),
  deliveryDate: z.string(),
  deliveryTimeSlot: z.string().optional(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  paymentMethod: z.enum(['razorpay', 'cod']),
  discount: z.number().optional(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const userId = getAuthUserId(request)
    const body = await request.json()
    const validation = createOrderSchema.safeParse(body)

    if (!validation.success) {
      throw new AppError(400, 'Invalid request', validation.error.errors)
    }

    const {
      clothes,
      pickupDate,
      pickupTimeSlot = '9:00 AM - 12:00 PM',
      deliveryDate,
      deliveryTimeSlot = '6:00 PM - 9:00 PM',
      address,
      latitude,
      longitude,
      paymentMethod,
      discount = 0,
      notes = '',
    } = validation.data

    // Generate order number
    const orderNumber = `ORD${Date.now()}`

    // Calculate pricing
    let subtotal = 0
    clothes.forEach((item) => {
      subtotal += item.price * item.quantity
    })

    const tax = Math.round(subtotal * 0.05)
    const deliveryFee = 50
    const total = Math.max(0, subtotal + tax + deliveryFee - discount)

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
        timeSlot: pickupTimeSlot,
        notes,
      },
      deliveryDetails: {
        address,
        latitude,
        longitude,
        estimatedDate: new Date(deliveryDate),
        timeSlot: deliveryTimeSlot,
      },
      status: 'pending',
      pricing: {
        subtotal,
        tax,
        discount,
        deliveryFee,
        total,
      },
      payment: {
        method: paymentMethod,
        status: 'pending',
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
