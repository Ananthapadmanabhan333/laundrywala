import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Order } from '@/models/Order'
import { Payment } from '@/models/Payment'
import { successResponse, errorResponse, AppError } from '@/utils/api'
import * as z from 'zod'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

const createPaymentSchema = z.object({
  orderId: z.string(),
  amount: z.number(),
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const validation = createPaymentSchema.safeParse(body)

    if (!validation.success) {
      throw new AppError(400, 'Invalid request', validation.error.errors)
    }

    const { orderId, amount } = validation.data

    const order = await Order.findById(orderId)
    if (!order) {
      throw new AppError(404, 'Order not found')
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: orderId,
    })

    // Save payment record
    const payment = new Payment({
      userId: order.userId,
      orderId,
      amount,
      method: 'razorpay',
      razorpayOrderId: razorpayOrder.id,
      status: 'pending',
    })
    await payment.save()

    return NextResponse.json(
      successResponse(
        {
          razorpayOrderId: razorpayOrder.id,
          amount,
          currency: 'INR',
          keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        },
        'Payment order created'
      )
    )
  } catch (error) {
    console.error('Payment Error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(
        errorResponse(error.message, error.statusCode),
        { status: error.statusCode }
      )
    }
    return NextResponse.json(
      errorResponse('Failed to create payment', 500),
      { status: 500 }
    )
  }
}
