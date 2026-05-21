'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { ChevronRight, MapPin, Clock, Wifi, ShieldCheck, ShoppingBag, Box, CheckCircle2 } from 'lucide-react'

interface OrderItem {
  category: string
  quantity: number
  service: string
}

interface TimelineEvent {
  status: string
  timestamp: string
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: string
  total: number
  category: 'tech_grocery' | 'fashion_care'
  items: OrderItem[]
  timeline: TimelineEvent[]
  address: string
  beaconCode: string
  notes: string
}

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: '#MND-8942',
    date: 'May 21, 2026',
    status: 'delivered',
    total: 1798,
    category: 'tech_grocery',
    items: [
      { category: '👔 Premium Shirts', quantity: 3, service: 'Wrinkle-Free Steam Press' },
      { category: '🧥 Designer Blazer', quantity: 1, service: 'Delicate Dry Cleaning' },
    ],
    timeline: [
      { status: 'Order placed & Secured', timestamp: '2026-05-21 04:15 PM' },
      { status: 'Smart Beacon logistics assigned', timestamp: '2026-05-21 04:22 PM' },
      { status: 'Collection courier dispatched', timestamp: '2026-05-21 04:30 PM' },
      { status: 'Garments cleaned & securely delivered back', timestamp: '2026-05-21 04:50 PM' },
    ],
    address: '123 Main Street, Penthouse 4B, New York, NY 10001',
    beaconCode: 'MN-BEACON-8942-X',
    notes: 'Safe drop behind the large entrance planter box. Do not ring bell.',
  },
  {
    id: '2',
    orderNumber: '#MND-7713',
    date: 'May 20, 2026',
    status: 'in_wash',
    total: 1547,
    category: 'fashion_care',
    items: [
      { category: '🧥 Casual Hoodies', quantity: 2, service: 'Eco-Wash & Fold' },
      { category: '🧵 Designer Silk Saree', quantity: 1, service: 'Couture Restoration' },
    ],
    timeline: [
      { status: 'Order placed & Secured', timestamp: '2026-05-20 11:00 AM' },
      { status: 'Logistics collection completed', timestamp: '2026-05-20 01:30 PM' },
      { status: 'Arrived at premium garment care facility', timestamp: '2026-05-20 02:45 PM' },
      { status: 'Undergoing eco-clean treatment & press', timestamp: '2026-05-20 04:00 PM' },
    ],
    address: '123 Main Street, Penthouse 4B, New York, NY 10001',
    beaconCode: 'MN-BEACON-7713-P',
    notes: 'Fragile fabrics. Please use eco-friendly garment bags for delivery drop.',
  },
]

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>('1')

  const selectedOrderData = MOCK_ORDERS.find((o) => o.id === selectedOrder)

  const getStatusDetails = (status: string) => {
    const details: Record<string, { label: string; bg: string; text: string; border: string }> = {
      pending: { label: 'Awaiting Verification', bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20' },
      assigned: { label: 'Courier Assigned', bg: 'bg-cyan-500/10', text: 'text-cyan-600', border: 'border-cyan-500/20' },
      collected: { label: 'Drop Collected', bg: 'bg-indigo-500/10', text: 'text-indigo-600', border: 'border-indigo-500/20' },
      in_wash: { label: 'Eco-Care Treatment', bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20' },
      in_iron: { label: 'Premium Ironing', bg: 'bg-violet-500/10', text: 'text-violet-600', border: 'border-violet-500/20' },
      ready: { label: 'Packed & Verified', bg: 'bg-teal-500/10', text: 'text-teal-600', border: 'border-teal-500/20' },
      out_for_delivery: { label: 'Smart Drop Transit', bg: 'bg-indigo-500/10', text: 'text-indigo-600', border: 'border-indigo-500/20' },
      delivered: { label: 'Secure Drop Completed', bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20' },
      cancelled: { label: 'Transaction Voided', bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20' },
    }
    return details[status] || details.pending
  }

  return (
    <div className="space-y-8 text-left animate-fade-in">
      {/* Title Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Box className="text-primary w-8 h-8" />
          <span>My Drops & Logistics Hub</span>
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          Real-time smart-beacon logistics, itemized receipts, and autonomous tracking for all your desires.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Orders List */}
        <div className="lg:col-span-7 space-y-4">
          {MOCK_ORDERS.length === 0 ? (
            <Card variant="elevated" className="border border-slate-100 p-8 text-center">
              <CardBody className="py-8 space-y-3 flex flex-col items-center">
                <ShoppingBag size={48} className="text-slate-200 animate-bounce" />
                <p className="font-extrabold text-slate-400">No orders dispatched yet.</p>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-4">
              {MOCK_ORDERS.map((order) => {
                const isSelected = selectedOrder === order.id
                const status = getStatusDetails(order.status)
                return (
                  <Card
                    key={order.id}
                    variant={isSelected ? 'elevated' : 'default'}
                    className={`cursor-pointer transition-all duration-300 border rounded-3xl overflow-hidden hover:shadow-md ${
                      isSelected
                        ? 'border-accent bg-emerald-50/5 ring-1 ring-accent'
                        : 'border-slate-200/60 bg-white hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedOrder(order.id)}
                  >
                    <CardBody className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-base text-slate-900 tracking-tight">
                              {order.orderNumber}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                              {order.category === 'tech_grocery' ? 'Tech & Grocery' : 'Fashion & Care'}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-400 mt-0.5">{order.date}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${status.bg} ${status.text} ${status.border}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      {/* Items details */}
                      <div className="space-y-2 border-y border-slate-100 py-3 mb-4 bg-slate-50/50 -mx-6 px-6">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-xs font-bold text-slate-700">
                            <span>
                              {item.quantity}× {item.category}
                            </span>
                            <span className="text-slate-400 font-medium text-[10px] bg-white px-2 py-0.5 rounded border border-slate-100">
                              {item.service}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Value</p>
                          <p className="text-lg font-black text-slate-900">₹{order.total}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`rounded-xl transition-transform ${isSelected ? 'text-accent translate-x-1' : 'text-slate-400'}`}
                        >
                          <span className="text-xs font-bold mr-1 uppercase tracking-wider">Track</span>
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Right: Timeline & Smart Tracking Details */}
        <div className="lg:col-span-5 sticky top-24">
          {selectedOrderData ? (
            <Card variant="elevated" className="border border-slate-200/80 shadow-lg rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-primary text-white p-5 border-b border-primary flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="text-accent animate-pulse w-4 h-4" />
                  <h2 className="text-xs font-black uppercase tracking-wider">Live Logistics Tracking</h2>
                </div>
                <span className="text-[10px] font-extrabold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                  Connected
                </span>
              </CardHeader>
              <CardBody className="p-5 space-y-6">
                {/* Timeline */}
                <div className="space-y-5 relative pl-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                  {selectedOrderData.timeline.map((event, index) => {
                    const isLast = index === selectedOrderData.timeline.length - 1
                    return (
                      <div key={index} className="relative text-left">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-[14px] top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center ${
                            isLast ? 'border-accent bg-accent/20 ring-4 ring-accent/15' : 'border-slate-300'
                          }`}
                        >
                          {isLast && <CheckCircle2 className="w-2.5 h-2.5 text-accent" />}
                        </div>

                        <div>
                          <p className={`text-xs font-extrabold leading-none ${isLast ? 'text-slate-900 font-black' : 'text-slate-500'}`}>
                            {event.status}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mt-1 leading-none">
                            <Clock size={10} />
                            {event.timestamp}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Secure Details Card */}
                <div className="space-y-3.5 border-t border-slate-100 pt-5">
                  {/* Smart Dispatch code */}
                  <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <ShieldCheck size={16} className="text-accent" />
                      <span>Smart Beacon Secure Dispatch</span>
                    </div>
                    <div className="bg-white border border-emerald-100 rounded-xl py-2 px-3 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BEACON CODE</span>
                      <span className="text-xs font-black text-accent tracking-wider font-mono select-all">
                        {selectedOrderData.beaconCode}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Location details */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex gap-2 items-start text-xs font-bold text-slate-800">
                      <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold">Delivery Location</p>
                        <p className="text-slate-500 font-semibold text-[11px] mt-0.5 leading-relaxed">
                          {selectedOrderData.address}
                        </p>
                      </div>
                    </div>
                    {selectedOrderData.notes && (
                      <div className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-200/50 p-2 rounded-xl">
                        💡 <span className="italic">Note: "{selectedOrderData.notes}"</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card variant="default" className="border border-dashed border-slate-200 p-8 text-center rounded-3xl bg-slate-50/50">
              <CardBody className="py-12 space-y-3 flex flex-col items-center">
                <Wifi size={36} className="text-slate-300 animate-pulse" />
                <p className="text-xs font-bold text-slate-400 max-w-xs leading-relaxed">
                  Select an active drop item from the historical records to establish secure telemetry connection.
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
