import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { successResponse, errorResponse, AppError } from '@/utils/api'
import * as z from 'zod'

const phoneSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const validation = phoneSchema.safeParse(body)

    if (!validation.success) {
      throw new AppError(400, 'Invalid phone number', validation.error.errors)
    }

    const { phone } = validation.data
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // In production, integrate with Twilio or Firebase for actual OTP sending
    console.log(`📱 OTP for ${phone}: ${otp}`)

    // Store OTP in session/cache (implement with Redis in production)
    const otpData = {
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    }

    // TODO: Store in Redis or database
    // For now, return success

    return NextResponse.json(
      successResponse(
        { phone, expiresIn: 300 },
        'OTP sent successfully'
      )
    )
  } catch (error) {
    console.error('OTP Error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(
        errorResponse(error.message, error.statusCode),
        { status: error.statusCode }
      )
    }
    return NextResponse.json(
      errorResponse('Failed to send OTP', 500),
      { status: 500 }
    )
  }
}
