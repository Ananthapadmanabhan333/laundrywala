import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Pricing } from '@/models/Pricing'
import { successResponse, errorResponse } from '@/utils/api'

export async function GET() {
  try {
    await connectDB()

    const pricing = await Pricing.find({ isActive: true }).sort({ category: 1 })

    return NextResponse.json(
      successResponse(
        pricing.map((p) => ({
          id: p._id,
          category: p.category,
          service: p.service,
          basePrice: p.basePrice,
          pricePerUnit: p.pricePerUnit,
          minPrice: p.minPrice,
          description: p.description,
        })),
        'Pricing retrieved'
      )
    )
  } catch (error) {
    console.error('Pricing Error:', error)
    return NextResponse.json(
      errorResponse('Failed to retrieve pricing', 500),
      { status: 500 }
    )
  }
}
