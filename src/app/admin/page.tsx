'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Users, ShoppingBag, TrendingUp, DollarSign, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true)
        const analyticsRes = await apiClient.get<any>('/api/admin/analytics')
        if (analyticsRes?.success) {
          setAnalytics(analyticsRes.data)
        }
        const ordersRes = await apiClient.get<any>('/api/admin/orders')
        if (ordersRes?.success) {
          setOrders(ordersRes.data)
        }
      } catch (e) {
        console.error('Failed to load admin telemetry dashboard details:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchAdminData()
  }, [])

  const stats = [
    {
      label: 'Total Revenue',
      value: analytics ? `₹${analytics.totalRevenue.toLocaleString()}` : '₹0',
      change: '+12.5%',
      icon: DollarSign,
      color: 'from-green-400 to-green-600',
    },
    {
      label: 'Total Orders',
      value: analytics ? analytics.totalOrders.toString() : '0',
      change: '+8.2%',
      icon: ShoppingBag,
      color: 'from-blue-400 to-blue-600',
    },
    {
      label: 'Active Users',
      value: analytics ? analytics.totalUsers.toString() : '0',
      change: '+23.1%',
      icon: Users,
      color: 'from-purple-400 to-purple-600',
    },
    {
      label: 'Growth Rate',
      value: '24.5%',
      change: '+4.3%',
      icon: TrendingUp,
      color: 'from-orange-400 to-orange-600',
    },
  ]

  const trendData = analytics?.trendData || []
  const statusData = analytics?.statusData || []

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary h-12 w-12" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Monitor business performance and manage operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} variant="elevated">
              <CardBody className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                </div>
                <p className="text-sm text-green-600 font-medium">{stat.change}</p>
              </CardBody>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-lg font-bold">Revenue & Orders Trend</h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4F46E5"
                  name="Revenue (₹)"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#06B6D4"
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Orders Distribution */}
        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-lg font-bold">Orders by Status</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {statusData.map((status: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {status.name}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {status.value}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${(status.value / Math.max(1, analytics?.totalOrders || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>


      {/* Recent Orders */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent Orders</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Items
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => {
                  const itemsString = order.clothes?.map((c: any) => `${c.quantity}x ${c.category}`).join(', ') || 'No items'
                  return (
                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{order.userId?.name || 'Customer'}</td>
                      <td className="py-3 px-4 text-gray-700">{itemsString}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        ₹{order.pricing?.total}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
