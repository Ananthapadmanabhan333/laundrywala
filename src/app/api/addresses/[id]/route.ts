import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Address } from '@/models/Address'
import { successResponse, errorResponse, AppError, getAuthUserId } from '@/utils/api'
import * as z from 'zod'

const updateAddressSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  addressLine: z.string().min(1, 'Address line is required').optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isDefault: z.boolean().optional(),
})

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB()
    const userId = getAuthUserId(request)
    const { id } = await params
    const body = await request.json()
    const validation = updateAddressSchema.safeParse(body)

    if (!validation.success) {
      throw new AppError(400, 'Invalid address details', validation.error.errors)
    }

    const address = await Address.findOne({ _id: id, userId })
    if (!address) {
      throw new AppError(404, 'Address not found')
    }

    const updateData = validation.data

    if (updateData.isDefault) {
      // Set all other default addresses of this user to false
      await Address.updateMany({ userId, _id: { $ne: id } }, { isDefault: false })
    }

    Object.assign(address, updateData)
    await address.save()

    return NextResponse.json(successResponse(address, 'Address updated successfully'))
  } catch (error) {
    console.error('Update Address Error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(errorResponse(error.message, error.statusCode), {
        status: error.statusCode,
      })
    }
    return NextResponse.json(errorResponse('Failed to update address', 500), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB()
    const userId = getAuthUserId(request)
    const { id } = await params

    const address = await Address.findOne({ _id: id, userId })
    if (!address) {
      throw new AppError(404, 'Address not found')
    }

    const wasDefault = address.isDefault
    await Address.deleteOne({ _id: id })

    // If we deleted the default address, set another address as default
    if (wasDefault) {
      const nextAddress = await Address.findOne({ userId })
      if (nextAddress) {
        nextAddress.isDefault = true
        await nextAddress.save()
      }
    }

    return NextResponse.json(successResponse(null, 'Address deleted successfully'))
  } catch (error) {
    console.error('Delete Address Error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(errorResponse(error.message, error.statusCode), {
        status: error.statusCode,
      })
    }
    return NextResponse.json(errorResponse('Failed to delete address', 500), { status: 500 })
  }
}
