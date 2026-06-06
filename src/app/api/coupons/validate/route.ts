import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Coupon } from '@/models/Coupon'
import { successResponse, errorResponse, AppError } from '@/utils/api'
import * as z from 'zod'

const validateSchema = z.object({
  code: z.string().trim().toUpperCase(),
  subtotal: z.number().min(0),
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const validation = validateSchema.safeParse(body)

    if (!validation.success) {
      throw new AppError(400, 'Invalid request payload', validation.error.errors)
    }

    const { code, subtotal } = validation.data

    const coupon = await Coupon.findOne({ code, isActive: true })

    if (!coupon) {
      throw new AppError(404, 'Coupon code is invalid or inactive')
    }

    if (new Date() > new Date(coupon.expiresAt)) {
      throw new AppError(400, 'Coupon has expired')
    }

    if (subtotal < coupon.minOrderValue) {
      throw new AppError(
        400,
        `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`
      )
    }

    let discount = 0
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.value) / 100)
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount
      }
    } else if (coupon.discountType === 'fixed') {
      discount = coupon.value
    }

    // Discount cannot exceed subtotal
    discount = Math.min(discount, subtotal)

    return NextResponse.json(
      successResponse(
        {
          code: coupon.code,
          discountType: coupon.discountType,
          value: coupon.value,
          discount,
        },
        'Coupon code validated successfully'
      )
    )
  } catch (error) {
    console.error('Coupon validation error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(errorResponse(error.message, error.statusCode), {
        status: error.statusCode,
      })
    }
    return NextResponse.json(errorResponse('Failed to validate coupon', 500), { status: 500 })
  }
}
