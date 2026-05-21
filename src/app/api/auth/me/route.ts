import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { successResponse, errorResponse, AppError } from '@/utils/api'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'Missing or invalid authorization header')
    }

    const token = authHeader.slice(7)

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      const user = await User.findById(decoded.userId)

      if (!user) {
        throw new AppError(404, 'User not found')
      }

      return NextResponse.json(
        successResponse({
          id: user._id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          address: user.address,
          latitude: user.latitude,
          longitude: user.longitude,
          accountType: user.accountType,
          isVerified: user.isVerified,
        })
      )
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError(401, 'Token expired')
      }
      throw new AppError(401, 'Invalid token')
    }
  } catch (error) {
    console.error('Get User Error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(
        errorResponse(error.message, error.statusCode),
        { status: error.statusCode }
      )
    }
    return NextResponse.json(
      errorResponse('Failed to get user', 500),
      { status: 500 }
    )
  }
}
