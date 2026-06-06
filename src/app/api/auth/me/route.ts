import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
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

    if (!token) {
      throw new AppError(401, 'Missing or invalid authentication token')
    }

    const { valid, payload, error } = verifyToken(token)
    if (!valid || !payload) {
      throw new AppError(401, error || 'Invalid token')
    }

    const userId = payload.userId || payload.sub
    if (!userId) {
      throw new AppError(401, 'Invalid token payload structure')
    }

    let user = null
    try {
      await connectDB()
      user = await User.findById(userId)
    } catch (dbError) {
      console.warn('⚠️ MongoDB connection failed in /api/auth/me. Running in Mock Development Mode.')
      user = {
        _id: userId,
        phone: payload.phone,
        name: payload.name || 'Mock Customer',
        accountType: payload.role || 'customer',
        isVerified: true,
        address: 'Default Address, Thiruvananthapuram',
        latitude: 8.5241,
        longitude: 76.9366,
      }
    }

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

export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    let token = request.cookies.get('auth-token')?.value
    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7)
      }
    }

    if (!token) {
      throw new AppError(401, 'Missing or invalid authentication token')
    }

    const { valid, payload } = verifyToken(token)
    if (!valid || !payload) {
      throw new AppError(401, 'Invalid token')
    }

    const userId = payload.userId || payload.sub
    const body = await request.json()
    const { name, email, address, latitude, longitude } = body

    const user = await User.findById(userId)
    if (!user) {
      throw new AppError(404, 'User not found')
    }

    if (name) user.name = name
    if (email !== undefined) user.email = email
    if (address) user.address = address
    if (latitude !== undefined) user.latitude = latitude
    if (longitude !== undefined) user.longitude = longitude

    await user.save()

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
      }, 'Profile updated successfully')
    )
  } catch (error) {
    console.error('Update User Error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(
        errorResponse(error.message, error.statusCode),
        { status: error.statusCode }
      )
    }
    return NextResponse.json(
      errorResponse('Failed to update user', 500),
      { status: 500 }
    )
  }
}


