import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Order } from '@/models/Order'
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

    const totalUsers = await User.countDocuments()
    const totalOrders = await Order.countDocuments()

    // Aggregate total revenue
    const revenueAggregation = await Order.aggregate([
      { $match: { 'payment.status': 'completed' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ])
    const totalRevenue = revenueAggregation[0]?.total || 0

    // Order status counts
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    const formattedStatusData = statusCounts.map((item) => ({
      name: item._id.replace('_', ' ').toUpperCase(),
      value: item.count,
    }))

    // Dynamic daily revenue for the past 7 days
    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          'payment.status': 'completed',
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$pricing.total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    const formattedTrendData = dailyRevenue.map((item) => ({
      date: item._id,
      revenue: item.revenue,
      orders: item.orders,
    }))

    return NextResponse.json(
      successResponse(
        {
          totalRevenue,
          totalOrders,
          totalUsers,
          statusData: formattedStatusData,
          trendData: formattedTrendData.length > 0 ? formattedTrendData : [
            { date: 'Mon', revenue: 0, orders: 0 },
            { date: 'Tue', revenue: 0, orders: 0 },
            { date: 'Wed', revenue: 0, orders: 0 },
            { date: 'Thu', revenue: 0, orders: 0 },
            { date: 'Fri', revenue: 0, orders: 0 },
            { date: 'Sat', revenue: 0, orders: 0 },
            { date: 'Sun', revenue: 0, orders: 0 },
          ],
        },
        'Analytics aggregated successfully'
      )
    )
  } catch (error) {
    console.error('Admin analytics error:', error)
    if (error instanceof AppError) {
      return NextResponse.json(errorResponse(error.message, error.statusCode), {
        status: error.statusCode,
      })
    }
    return NextResponse.json(errorResponse('Failed to fetch analytics', 500), { status: 500 })
  }
}
