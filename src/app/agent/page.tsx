'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { apiClient } from '@/lib/api-client'
import { MapPin, Phone, CheckCircle, Clock, Navigation, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

export default function AgentDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get<any>('/api/agent/orders')
      if (res?.success && res.data) {
        setOrders(res.data)
        if (res.data.length > 0 && !selectedOrder) {
          setSelectedOrder(res.data[0]._id)
        }
      }
    } catch (e) {
      console.error('Failed to load agent dispatches:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const selectedOrderData = orders.find((o) => o._id === selectedOrder)

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: any }> = {
      assigned: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
      collected: { bg: 'bg-purple-100', text: 'text-purple-800', icon: CheckCircle },
      in_wash: { bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock },
      ready: { bg: 'bg-teal-100', text: 'text-teal-800', icon: CheckCircle },
      out_for_delivery: { bg: 'bg-orange-100', text: 'text-orange-800', icon: Navigation },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    }
    return badges[status] || { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setIsUpdating(true)
      const res = await apiClient.put<any>(`/api/orders/${orderId}`, {
        status: newStatus,
      })
      if (res?.success) {
        toast.success(`Status updated to ${newStatus.replace('_', ' ').toUpperCase()}`)
        fetchOrders()
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update order status')
    } finally {
      setIsUpdating(false)
    }
  }

  const openMapsNavigation = (lat: number, lon: number) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`
    window.open(mapsUrl, '_blank')
  }

  return (
    <div className="p-4 sm:p-6 text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Delivery Agent Panel
        </h1>
        <p className="text-gray-600">Manage your assigned deliveries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-2">
          {loading ? (
            <Card variant="elevated">
              <CardBody className="flex justify-center py-8">
                <Loader2 className="animate-spin text-primary h-8 w-8" />
              </CardBody>
            </Card>
          ) : orders.length === 0 ? (
            <Card variant="elevated">
              <CardBody>
                <p className="text-center text-gray-600 py-8">
                  No orders assigned
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const badge = getStatusBadge(order.status)
                const itemsString = order.clothes?.map((c: any) => `${c.quantity}x ${c.category}`).join(', ') || 'No items'
                return (
                  <Card
                    key={order._id}
                    variant="elevated"
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedOrder === order._id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedOrder(order._id)}
                  >
                    <CardBody>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-600">{order.userId?.name || 'Customer'}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}
                        >
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-700">
                          <strong>Items:</strong> {itemsString}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Scheduled Collection Date:</strong> {new Date(order.pickupDetails?.scheduledDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Time Slot:</strong> {order.pickupDetails?.timeSlot || 'Anytime'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (order.userId?.phone) window.open(`tel:${order.userId.phone}`)
                          }}
                        >
                          <Phone size={16} className="mr-1" />
                          Call
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            openMapsNavigation(order.pickupDetails?.latitude || 12.9716, order.pickupDetails?.longitude || 77.5946)
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
                    {selectedOrderData.userId?.name || 'Customer'}
                  </p>
                  <p className="text-sm text-gray-600">{selectedOrderData.userId?.phone || 'No phone'}</p>
                  {selectedOrderData.userId?.phone && (
                    <Button
                      size="sm"
                      variant="ghost"
                      fullWidth
                      className="mt-2"
                      onClick={() => window.open(`tel:${selectedOrderData.userId.phone}`)}
                    >
                      <Phone size={16} className="mr-2" />
                      Call Customer
                    </Button>
                  )}
                </div>

                {/* Pickup Address */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Pickup Address
                  </p>
                  <p className="text-sm text-gray-900 flex gap-2">
                    <MapPin size={16} className="text-primary flex-shrink-0" />
                    {selectedOrderData.pickupDetails?.address}
                  </p>
                </div>

                {/* Delivery Address */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Delivery Address
                  </p>
                  <p className="text-sm text-gray-900 flex gap-2">
                    <MapPin size={16} className="text-primary flex-shrink-0" />
                    {selectedOrderData.deliveryDetails?.address}
                  </p>
                </div>

                {/* Status Update */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Update Status
                  </p>
                  {isUpdating ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="animate-spin text-primary h-5 w-5" />
                    </div>
                  ) : (
                    <select
                      value={selectedOrderData.status}
                      onChange={(e) =>
                        handleStatusUpdate(selectedOrderData._id, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    >
                      <option value="assigned">Assigned</option>
                      <option value="collected">Collected</option>
                      <option value="in_wash">In Care Facility</option>
                      <option value="ready">Ready back</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    fullWidth
                    onClick={() =>
                      openMapsNavigation(
                        selectedOrderData.pickupDetails?.latitude || 12.9716,
                        selectedOrderData.pickupDetails?.longitude || 77.5946
                      )
                    }
                  >
                    <Navigation size={16} className="mr-2" />
                    Get Directions
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
