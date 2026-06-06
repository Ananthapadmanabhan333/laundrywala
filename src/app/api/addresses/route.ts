import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Address } from '@/models/Address'
import { successResponse, errorResponse, AppError, getAuthUserId } from '@/utils/api'
import * as z from 'zod'

const createAddressSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  addressLine: z.string().min(1, 'Address line is required'),
  latitude: z.number(),
  longitude: z.number(),
  isDefault: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const userId = getAuthUserId(request)

    const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 })
    return NextResponse.json(successResponse(addresses, 'Addresses retrieved successfully'))
  } catch (error) {
    console.error('Get Addresses Error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(errorResponse(error.message, error.statusCode), {
        status: error.statusCode,
      })
    }
    return NextResponse.json(errorResponse('Failed to retrieve addresses', 500), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const userId = getAuthUserId(request)
    const body = await request.json()
    const validation = createAddressSchema.safeParse(body)

    if (!validation.success) {
      throw new AppError(400, 'Invalid address details', validation.error.errors)
    }

    const { title, addressLine, latitude, longitude, isDefault = false } = validation.data

    if (isDefault) {
      // Set all other default addresses of this user to false
      await Address.updateMany({ userId, isDefault: true }, { isDefault: false })
    }

    // If it's the first address, make it default regardless
    const addressCount = await Address.countDocuments({ userId })
    const finalIsDefault = addressCount === 0 ? true : isDefault

    const address = new Address({
      userId,
      title,
      addressLine,
      latitude,
      longitude,
      isDefault: finalIsDefault,
    })

    await address.save()

    return NextResponse.json(successResponse(address, 'Address created successfully', 21))
  } catch (error) {
    console.error('Create Address Error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(errorResponse(error.message, error.statusCode), {
        status: error.statusCode,
      })
    }
    return NextResponse.json(errorResponse('Failed to create address', 500), { status: 500 })
  }
}
