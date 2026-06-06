import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Pricing } from '@/models/Pricing'
import { successResponse, errorResponse, AppError } from '@/utils/api'
import { verifyToken } from '@/lib/auth'

const DEFAULT_PRICING = [
  { category: 'shirts', service: 'wash_iron', basePrice: 30, pricePerUnit: 30, description: 'Formal Shirt' },
  { category: 't-shirts', service: 'wash', basePrice: 20, pricePerUnit: 20, description: 'Cotton T-Shirt' },
  { category: 'jeans', service: 'wash_iron', basePrice: 40, pricePerUnit: 40, description: 'Trouser / Jeans' },
  { category: 'sarees', service: 'dry_clean', basePrice: 80, pricePerUnit: 80, description: 'Designer Silk Saree' },
  { category: 'blazers', service: 'dry_clean', basePrice: 100, pricePerUnit: 100, description: 'Designer Blazer' },
  { category: 'blankets', service: 'premium', basePrice: 150, pricePerUnit: 150, description: 'Duvet / Heavy Blanket' },
  { category: 'curtains', service: 'wash', basePrice: 80, pricePerUnit: 80, description: 'Curtain' },
  { category: 'shoes', service: 'premium', basePrice: 120, pricePerUnit: 120, description: 'Premium Shoes' },
]

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    let pricingList = await Pricing.find({ isActive: true })

    if (pricingList.length === 0) {
      console.log('Seeding initial pricing table...')
      await Pricing.insertMany(DEFAULT_PRICING)
      pricingList = await Pricing.find({ isActive: true })
    }

    return NextResponse.json(successResponse(pricingList, 'Pricing retrieved successfully'))
  } catch (error) {
    console.error('Pricing GET error:', error)
    return NextResponse.json(errorResponse('Failed to fetch pricing', 500), { status: 500 })
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
    const { category, service, basePrice, pricePerUnit, description } = body

    const pricing = await Pricing.findOneAndUpdate(
      { category, service },
      { basePrice, pricePerUnit, description, isActive: true },
      { new: true, upsert: true }
    )

    return NextResponse.json(successResponse(pricing, 'Pricing updated successfully'))
  } catch (error) {
    console.error('Pricing POST error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(errorResponse(error.message, error.statusCode), {
        status: error.statusCode,
      })
    }
    return NextResponse.json(errorResponse('Failed to update pricing', 500), { status: 500 })
  }
}
