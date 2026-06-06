import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { successResponse, errorResponse, AppError } from '@/utils/api'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Auth check (Admin only)
    const token = request.cookies.get('auth-token')?.value
    if (!token) throw new AppError(401, 'Unauthorized')
    const { valid, payload } = verifyToken(token)
    if (!valid || !payload || (payload.role !== 'admin' && payload.accountType !== 'admin')) {
      throw new AppError(403, 'Forbidden: Admin access required')
    }

    const users = await User.find().sort({ createdAt: -1 })
    return NextResponse.json(successResponse(users, 'Users retrieved successfully'))
  } catch (error) {
    console.error('Admin users GET error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(errorResponse(error.message, error.statusCode), {
        status: error.statusCode,
      })
    }
    return NextResponse.json(errorResponse('Failed to fetch users', 500), { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    // Auth check (Admin only)
    const token = request.cookies.get('auth-token')?.value
    if (!token) throw new AppError(401, 'Unauthorized')
    const { valid, payload } = verifyToken(token)
    if (!valid || !payload || (payload.role !== 'admin' && payload.accountType !== 'admin')) {
      throw new AppError(403, 'Forbidden: Admin access required')
    }

    const body = await request.json()
    const { userId, accountType, isActive } = body

    const user = await User.findById(userId)
    if (!user) {
      throw new AppError(404, 'User not found')
    }

    if (accountType) {
      user.accountType = accountType
    }
    if (isActive !== undefined) {
      user.isActive = isActive
    }

    await user.save()

    return NextResponse.json(successResponse(user, 'User updated successfully'))
  } catch (error) {
    console.error('Admin user PUT error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(errorResponse(error.message, error.statusCode), {
        status: error.statusCode,
      })
    }
    return NextResponse.json(errorResponse('Failed to update user', 500), { status: 500 })
  }
}
