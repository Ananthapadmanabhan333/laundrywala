'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { MapPin, Phone, CheckCircle, Clock, Navigation } from 'lucide-react'

const AGENT_ORDERS = [
  {
    id: '1',
    orderNumber: '#ORD001',
    customer: 'John Doe',
    phone: '+91 98765 43210',
    status: 'pickup_assigned',
    items: 'Shirts (2), Jeans (1)',
    pickupAddress: '123 Main St, Apt 4B',
    deliveryAddress: '456 Oak Ave, Suite 200',
    latitude: 40.7128,
    longitude: -74.006,
    estimatedPickupTime: '11:00 AM - 12:00 PM',
    distance: '2.3 km',
  },
  {
    id: '2',
    orderNumber: '#ORD002',
    customer: 'Jane Smith',
    phone: '+91 98765 43211',
    status: 'collected',
    items: 'Saree (1), Blazer (1)',
    pickupAddress: '789 Elm St',
    deliveryAddress: '321 Pine Rd',
    latitude: 40.758,
    longitude: -73.9855,
    estimatedPickupTime: '1:00 PM - 2:00 PM',
    distance: '1.8 km',
  },
]

export default function AgentDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>({})

  const selectedOrderData = AGENT_ORDERS.find((o) => o.id === selectedOrder)

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: any }> = {
      pickup_assigned: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
      collected: { bg: 'bg-purple-100', text: 'text-purple-800', icon: CheckCircle },
      in_transit: { bg: 'bg-orange-100', text: 'text-orange-800', icon: Navigation },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    }
    return badges[status] || badges.pickup_assigned
  }

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrderStatuses((prev) => ({ ...prev, [orderId]: newStatus }))
  }

  const openMapsNavigation = (lat: number, lon: number) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`
    window.open(mapsUrl, '_blank')
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Delivery Agent Panel
        </h1>
        <p className="text-gray-600">Manage your assigned deliveries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-2">
          {AGENT_ORDERS.length === 0 ? (
            <Card variant="elevated">
              <CardBody>
                <p className="text-center text-gray-600 py-8">
                  No orders assigned
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-4">
              {AGENT_ORDERS.map((order) => {
                const badge = getStatusBadge(order.status)
                return (
                  <Card
                    key={order.id}
                    variant="elevated"
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedOrder === order.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedOrder(order.id)}
                  >
                    <CardBody>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}
                        >
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-700">
                          <strong>Items:</strong> {order.items}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Pickup:</strong> {order.estimatedPickupTime}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Distance:</strong> {order.distance}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`tel:${order.phone}`)
                          }}
                        >
                          <Phone size={16} className="mr-1" />
                          Call
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            openMapsNavigation(order.latitude, order.longitude)
                          }}
                        >
                          <Navigation size={16} className="mr-1" />
                          Navigate
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Order Details */}
        {selectedOrderData && (
          <div className="sticky top-24">
            <Card variant="elevated">
              <CardHeader>
                <h2 className="text-lg font-bold">Order Details</h2>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* Customer Info */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Customer Details
                  </p>
                  <p className="font-semibold text-gray-900">
                    {selectedOrderData.customer}
                  </p>
                  <p className="text-sm text-gray-600">{selectedOrderData.phone}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    fullWidth
                    className="mt-2"
                    onClick={() => window.open(`tel:${selectedOrderData.phone}`)}
                  >
                    <Phone size={16} className="mr-2" />
                    Call Customer
                  </Button>
                </div>

                {/* Pickup Address */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Pickup Address
                  </p>
                  <p className="text-sm text-gray-900 flex gap-2">
                    <MapPin size={16} className="text-primary flex-shrink-0" />
                    {selectedOrderData.pickupAddress}
                  </p>
                </div>

                {/* Delivery Address */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Delivery Address
                  </p>
                  <p className="text-sm text-gray-900 flex gap-2">
                    <MapPin size={16} className="text-primary flex-shrink-0" />
                    {selectedOrderData.deliveryAddress}
                  </p>
                </div>

                {/* Status Update */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Update Status
                  </p>
                  <select
                    defaultValue={selectedOrderData.status}
                    onChange={(e) =>
                      handleStatusUpdate(selectedOrderData.id, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value="pickup_assigned">Pickup Assigned</option>
                    <option value="collected">Collected</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    fullWidth
                    onClick={() =>
                      openMapsNavigation(
                        selectedOrderData.latitude,
                        selectedOrderData.longitude
                      )
                    }
                  >
                    <Navigation size={16} className="mr-2" />
                    Get Directions
                  </Button>
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={() =>
                      window.open(`tel:${selectedOrderData.phone}`)
                    }
                  >
                    <Phone size={16} className="mr-2" />
                    Call Customer
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
