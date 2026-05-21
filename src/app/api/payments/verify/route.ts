import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Payment } from '@/models/Payment'
import { Order } from '@/models/Order'
import { successResponse, errorResponse, AppError } from '@/utils/api'
import * as z from 'zod'
import crypto from 'crypto'

const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const validation = verifyPaymentSchema.safeParse(body)

    if (!validation.success) {
      throw new AppError(400, 'Invalid request', validation.error.errors)
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = validation.data

    // Verify signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    shasum.update(razorpayOrderId + '|' + razorpayPaymentId)
    const computedSignature = shasum.digest('hex')

    if (computedSignature !== razorpaySignature) {
      throw new AppError(400, 'Invalid payment signature')
    }

    // Update payment record
    const payment = await Payment.findOne({ razorpayOrderId })
    if (!payment) {
      throw new AppError(404, 'Payment not found')
    }

    payment.razorpayPaymentId = razorpayPaymentId
    payment.razorpaySignature = razorpaySignature
    payment.status = 'completed'
    await payment.save()

    // Update order status
    const order = await Order.findById(payment.orderId)
    if (order) {
      order.payment.status = 'completed'
      order.payment.transactionId = razorpayPaymentId
      order.payment.paidAt = new Date()
      await order.save()
    }

    return NextResponse.json(
      successResponse(
        {
          status: 'completed',
          paymentId: razorpayPaymentId,
        },
        'Payment verified successfully'
      )
    )
  } catch (error) {
    console.error('Verification Error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(
        errorResponse(error.message, error.statusCode),
        { status: error.statusCode }
      )
    }
    return NextResponse.json(
      errorResponse('Failed to verify payment', 500),
      { status: 500 }
    )
  }
}
