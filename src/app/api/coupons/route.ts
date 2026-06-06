import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Coupon } from '@/models/Coupon'
import { successResponse, errorResponse, AppError } from '@/utils/api'
import { verifyToken } from '@/lib/auth'

const DEFAULT_COUPONS = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    value: 10,
    minOrderValue: 200,
    maxDiscount: 100,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    isActive: true,
  },
  {
    code: 'MANOFREE',
    discountType: 'fixed',
    value: 50,
    minOrderValue: 300,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    isActive: true,
  },
]

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    let coupons = await Coupon.find({ isActive: true })

    if (coupons.length === 0) {
      console.log('Seeding default coupons...')
      await Coupon.insertMany(DEFAULT_COUPONS)
      coupons = await Coupon.find({ isActive: true })
    }

    return NextResponse.json(successResponse(coupons, 'Coupons retrieved successfully'))
  } catch (error) {
    console.error('Coupons GET error:', error)
    return NextResponse.json(errorResponse('Failed to fetch coupons', 500), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
    const { code, discountType, value, minOrderValue, maxDiscount, expiresAt } = body

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      value,
      minOrderValue: minOrderValue || 0,
      maxDiscount,
      expiresAt: new Date(expiresAt),
      isActive: true,
    })

    await coupon.save()

    return NextResponse.json(successResponse(coupon, 'Coupon created successfully'))
  } catch (error) {
    console.error('Coupon creation error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(errorResponse(error.message, error.statusCode), {
        status: error.statusCode,
      })
    }
    return NextResponse.json(errorResponse('Failed to create coupon', 500), { status: 500 })
  }
}
