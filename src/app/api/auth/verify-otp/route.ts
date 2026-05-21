import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { successResponse, errorResponse, AppError } from '@/utils/api'
import * as z from 'zod'
import jwt from 'jsonwebtoken'

const verifyOtpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  name: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const validation = verifyOtpSchema.safeParse(body)

    if (!validation.success) {
      throw new AppError(400, 'Invalid request', validation.error.errors)
    }

    const { phone, otp, name, latitude, longitude, address } = validation.data

    // TODO: Verify OTP from Redis/cache
    // For development, accept any 6-digit OTP
    if (!otp.match(/^\d{6}$/)) {
      throw new AppError(400, 'Invalid OTP format')
    }

    let user = await User.findOne({ phone })

    if (!user) {
      // Create new user
      if (!name || !address || latitude === undefined || longitude === undefined) {
        throw new AppError(400, 'Name, address, and location are required for new users')
      }

      user = new User({
        phone,
        name,
        address,
        latitude,
        longitude,
        accountType: 'customer',
        isVerified: true,
      })
      await user.save()
    } else {
      // Update existing user
      user.isVerified = true
      if (name) user.name = name
      if (address) user.address = address
      if (latitude !== undefined) user.latitude = latitude
      if (longitude !== undefined) user.longitude = longitude
      await user.save()
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        phone: user.phone,
        accountType: user.accountType,
      },
      process.env.JWT_SECRET || 'default_secret_key_123',
      { expiresIn: (process.env.JWT_EXPIRY as any) || '7d' }
    )

    return NextResponse.json(
      successResponse(
        {
          token,
          user: {
            id: user._id,
            phone: user.phone,
            name: user.name,
            email: user.email,
            address: user.address,
            latitude: user.latitude,
            longitude: user.longitude,
            accountType: user.accountType,
            isVerified: user.isVerified,
          },
        },
        'Logged in successfully'
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
      errorResponse('Verification failed', 500),
      { status: 500 }
    )
  }
}
