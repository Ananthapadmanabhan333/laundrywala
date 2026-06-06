import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Notification } from '@/models/Notification'
import { successResponse, errorResponse, AppError, getAuthUserId } from '@/utils/api'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const userId = getAuthUserId(request)

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 })
    return NextResponse.json(
      successResponse(notifications, 'Notifications retrieved successfully')
    )
  } catch (error) {
    console.error('Notifications GET error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(errorResponse(error.message, error.statusCode), {
        status: error.statusCode,
      })
    }
    return NextResponse.json(errorResponse('Failed to fetch notifications', 500), { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const userId = getAuthUserId(request)

    await Notification.updateMany({ userId, isRead: false }, { isRead: true })

    return NextResponse.json(successResponse(null, 'All notifications marked as read'))
  } catch (error) {
    console.error('Notifications PUT error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(errorResponse(error.message, error.statusCode), {
        status: error.statusCode,
      })
    }
    return NextResponse.json(errorResponse('Failed to update notifications', 500), { status: 500 })
  }
}
