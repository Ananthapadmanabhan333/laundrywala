'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Users, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react'

const REVENUE_DATA = [
  { date: 'Mon', revenue: 4000, orders: 24 },
  { date: 'Tue', revenue: 3000, orders: 12 },
  { date: 'Wed', revenue: 2000, orders: 10 },
  { date: 'Thu', revenue: 5000, orders: 29 },
  { date: 'Fri', revenue: 4500, orders: 24 },
  { date: 'Sat', revenue: 6000, orders: 35 },
  { date: 'Sun', revenue: 5500, orders: 32 },
]

const ORDERS_DATA = [
  { name: 'Pending', value: 12, color: '#FCD34D' },
  { name: 'In Progress', value: 24, color: '#60A5FA' },
  { name: 'Completed', value: 234, color: '#10B981' },
  { name: 'Cancelled', value: 8, color: '#EF4444' },
]

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Total Revenue',
      value: '₹29,500',
      change: '+12.5%',
      icon: DollarSign,
      color: 'from-green-400 to-green-600',
    },
    {
      label: 'Total Orders',
      value: '278',
      change: '+8.2%',
      icon: ShoppingBag,
      color: 'from-blue-400 to-blue-600',
    },
    {
      label: 'Active Users',
      value: '1,245',
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

  return (
    <div className="p-4 sm:p-6">
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
              <LineChart data={REVENUE_DATA}>
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
              {ORDERS_DATA.map((status, index) => (
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
                      className="h-2 rounded-full"
                      style={{
                        width: `${(status.value / 300) * 100}%`,
                        backgroundColor: status.color,
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
                {[
                  {
                    id: '#ORD001',
                    customer: 'John Doe',
                    items: 'Shirts, Jeans',
                    amount: '₹299',
                    status: 'Delivered',
                  },
                  {
                    id: '#ORD002',
                    customer: 'Jane Smith',
                    items: 'Saree, Blazer',
                    amount: '₹449',
                    status: 'In Progress',
                  },
                  {
                    id: '#ORD003',
                    customer: 'Mike Johnson',
                    items: 'Shirts, T-Shirts',
                    amount: '₹199',
                    status: 'Pending',
                  },
                ].map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{order.customer}</td>
                    <td className="py-3 px-4 text-gray-700">{order.items}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {order.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
