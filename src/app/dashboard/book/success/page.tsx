'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card'
import { Check, ClipboardCheck, Calendar, Clock, CreditCard, ShieldCheck, Loader2 } from 'lucide-react'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const orderNumber = searchParams.get('orderNumber') || `ORD-${Date.now()}`
  const pickupDate = searchParams.get('pickupDate') ? new Date(searchParams.get('pickupDate')!).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'Scheduled Collection'
  const pickupTime = searchParams.get('pickupTime') || 'Morning Dispatch'
  const totalPaid = searchParams.get('totalPaid') || '0'

  return (
    <div className="max-w-xl mx-auto py-12 text-center animate-fade-in space-y-8">
      {/* Dynamic Success Checkmark Banner */}
      <div className="flex flex-col items-center space-y-4">
        <div className="w-20 h-20 bg-accent/10 border-4 border-accent rounded-full flex items-center justify-center text-accent shadow-lg animate-pulse">
          <Check size={40} className="stroke-[3]" />
        </div>
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
            Vault Dispatch Verified
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Confirmed!</h1>
          <p className="text-sm font-semibold text-slate-500 max-w-sm mx-auto">
            Your premium fabric care telemetry dispatch has been securely initialized.
          </p>
        </div>
      </div>

      {/* Itemized Order Details Card */}
      <Card variant="elevated" className="border-2 border-primary/15 shadow-xl rounded-3xl overflow-hidden bg-white text-left">
        <CardHeader className="bg-primary text-white p-5 border-b border-primary">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <ClipboardCheck size={18} className="text-accent" />
              <h2 className="text-xs font-black uppercase tracking-wider">Garment Care Vault</h2>
            </div>
            <span className="font-mono text-xs font-black text-accent tracking-wider select-all">
              {orderNumber}
            </span>
          </div>
        </CardHeader>
        <CardBody className="p-6 space-y-5">
          
          <div className="flex items-start gap-4">
            <Calendar className="text-slate-400 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Scheduled Pickup Date</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{pickupDate}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="text-slate-400 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Pickup Hour Slot</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{pickupTime}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <CreditCard className="text-slate-400 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Amount Charged</p>
              <p className="text-base font-black text-accent mt-0.5">₹{totalPaid}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <ShieldCheck size={16} className="text-accent" />
              <span>Smart Beacon Secure Dispatch Code</span>
            </div>
            <div className="bg-white border border-emerald-100 rounded-xl py-2 px-3 flex justify-between items-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">BEACON KEY</span>
              <span className="text-xs font-black text-accent tracking-wider font-mono select-all">
                {`MN-BEACON-${orderNumber.slice(-4)}-X`}
              </span>
            </div>
          </div>

        </CardBody>
        <CardFooter className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <Button
            fullWidth
            onClick={() => router.push('/dashboard/orders')}
            className="bg-gradient-to-r from-accent to-emerald-500 hover:from-emerald-500 hover:to-accent text-slate-950 font-black py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            Track My Order
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => router.push('/dashboard')}
            className="rounded-xl border-slate-200 font-bold py-3.5 text-xs"
          >
            Dashboard Hub
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
