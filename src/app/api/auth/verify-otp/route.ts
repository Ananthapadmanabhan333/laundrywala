import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { successResponse, errorResponse, AppError } from '@/utils/api'
import * as z from 'zod'
import jwt from 'jsonwebtoken'
import { setAuthCookie } from '@/lib/auth'

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

    let user = null
    let isMockMode = false

    try {
      await connectDB()
      user = await User.findOne({ phone })
    } catch (dbError) {
      console.warn('⚠️ MongoDB connection failed. Running in Mock Development Mode.')
      isMockMode = true;
    }

    if (isMockMode) {
      user = {
        _id: 'mock_user_id_123',
        phone,
        name: name || 'Mock Customer',
        address: address || '123 Mock Street',
        latitude: latitude || 12.9716,
        longitude: longitude || 77.5946,
        accountType: 'customer',
        isVerified: true,
      }
    } else if (!user) {
      // Create new user
      // For development/demo purposes, auto-fill with defaults if missing
      const finalName = name || 'New Customer'
      const finalAddress = address || 'Default Address, Thiruvananthapuram'
      const finalLatitude = latitude !== undefined ? latitude : 8.5241
      const finalLongitude = longitude !== undefined ? longitude : 76.9366

      user = new User({
        phone,
        name: finalName,
        address: finalAddress,
        latitude: finalLatitude,
        longitude: finalLongitude,
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

    // Set HttpOnly cookie
    const response = NextResponse.json(
      successResponse(
        {
          // token is not sent in body for security; client will rely on cookie
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
    ));
    // Use cookie helper to set cookie
    setAuthCookie(response, token);
    return response;
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
