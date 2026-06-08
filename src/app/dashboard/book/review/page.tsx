'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { apiClient } from '@/lib/api-client'
import { toast } from 'react-toastify'
import {
  Plus,
  Minus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  Tag,
  Loader2,
  Calendar,
  ShoppingCart,
  CheckCircle2
} from 'lucide-react'

const SERVICES = [
  { id: 'wash', name: 'Wash Only', description: 'Eco-clean standard wash', priceMultiplier: 1.0 },
  { id: 'wash_iron', name: 'Wash + Iron', description: 'Cleaned and premium pressed', priceMultiplier: 1.5 },
  { id: 'dry_clean', name: 'Dry Clean', description: 'Professional organic dry clean', priceMultiplier: 2.0 },
  { id: 'premium', name: 'Couture Restoration', description: 'Intensive restoration & sanitizer care', priceMultiplier: 2.5 },
]

export default function CheckoutReviewPage() {
  const router = useRouter()
  const { items, updateItem, removeItem, clearCart } = useCartStore()
  const { user } = useAuthStore()

  // Addresses State
  const [addresses, setAddresses] = useState<any[]>([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addressFormData, setAddressFormData] = useState({
    title: 'Home',
    addressLine: '',
    latitude: 12.9716,
    longitude: 77.5946,
    isDefault: false,
  })

  // Date & Scheduling slots
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTimeSlot, setPickupTimeSlot] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('')
  const [notes, setNotes] = useState('')

  // Coupon State
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('cod')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch initial addresses
  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true)
      const res = await apiClient.get<any>('/api/addresses')
      if (res?.success && res.data) {
        setAddresses(res.data)
        const def = res.data.find((a: any) => a.isDefault)
        if (def) setSelectedAddressId(def._id)
        else if (res.data.length > 0) setSelectedAddressId(res.data[0]._id)
      }
    } catch (e) {
      console.error('Failed to load user addresses:', e)
    } finally {
      setLoadingAddresses(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  // Auto calculate default delivery date (e.g. +3 days from pickup date)
  useEffect(() => {
    if (pickupDate) {
      const pDate = new Date(pickupDate)
      const dDate = new Date(pDate)
      dDate.setDate(pDate.getDate() + 3)
      setDeliveryDate(dDate.toISOString().split('T')[0])
    }
  }, [pickupDate])

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const subtotal = calculateSubtotal()
  const tax = Math.round(subtotal * 0.05)
  const deliveryFee = 50
  const grandTotal = Math.max(0, subtotal + tax + deliveryFee - discountAmount)

  // Handle Apply Coupon
  const handleApplyCoupon = async () => {
    if (!couponCode) return
    try {
      const res = await apiClient.post<any>('/api/coupons/validate', {
        code: couponCode,
        subtotal
      })
      if (res?.success && res.data) {
        setAppliedCoupon(res.data)
        setDiscountAmount(res.data.discount)
        toast.success(`Coupon ${res.data.code} applied successfully!`)
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to apply coupon')
      setAppliedCoupon(null)
      setDiscountAmount(0)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setDiscountAmount(0)
    setCouponCode('')
    toast.info('Coupon removed')
  }

  // Handle Saved Address Submission
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await apiClient.post<any>('/api/addresses', addressFormData)
      if (res?.success && res.data) {
        toast.success('Address saved successfully!')
        setIsModalOpen(false)
        setAddressFormData({
          title: 'Home',
          addressLine: '',
          latitude: 12.9716,
          longitude: 77.5946,
          isDefault: false,
        })
        // Refresh address list and auto-select the newly added address
        const response = await apiClient.get<any>('/api/addresses')
        if (response?.success && response.data) {
          setAddresses(response.data)
          setSelectedAddressId(res.data._id || response.data[0]?._id)
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save address')
    }
  }

  // Dynamic Razorpay Script Loading
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const triggerOrderCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your checkout cart is empty.')
      return
    }
    if (!selectedAddressId) {
      toast.error('Please select a pickup and delivery address.')
      return
    }
    if (!pickupDate || !pickupTimeSlot) {
      toast.error('Please choose a preferred collection slot.')
      return
    }
    if (!deliveryDate || !deliveryTimeSlot) {
      toast.error('Please choose a preferred doorstep delivery slot.')
      return
    }

    const addr = addresses.find(a => a._id === selectedAddressId)
    if (!addr) {
      toast.error('Selected address is invalid.')
      return
    }

    setIsSubmitting(true)
    try {
      // Create MongoDB Order
      const orderRes = await apiClient.post<any>('/api/orders', {
        clothes: items.map(item => ({
          category: item.category,
          quantity: item.quantity,
          service: item.service,
          price: item.price
        })),
        pickupDate,
        pickupTimeSlot,
        deliveryDate,
        deliveryTimeSlot,
        address: addr.addressLine,
        latitude: addr.latitude,
        longitude: addr.longitude,
        paymentMethod,
        discount: discountAmount,
        notes
      })

      if (!orderRes?.success || !orderRes.data) {
        throw new Error(orderRes?.message || 'Failed to create order')
      }

      const { orderId, orderNumber } = orderRes.data

      if (paymentMethod === 'cod') {
        toast.success('Your order is verified! Ready for pickup.')
        clearCart()
        router.push(
          `/dashboard/book/success?orderId=${orderId}&orderNumber=${orderNumber}&pickupDate=${pickupDate}&pickupTime=${encodeURIComponent(
            pickupTimeSlot
          )}&totalPaid=${grandTotal}`
        )
      } else {
        // Razorpay Online Integration
        const isLoaded = await loadRazorpayScript()
        if (!isLoaded) {
          toast.error('Razorpay SDK failed to load. Check your connection.')
          setIsSubmitting(false)
          return
        }

        // Create transaction record and fetch transaction Details
        const payOrderRes = await apiClient.post<any>('/api/payments/create', {
          orderId,
          amount: grandTotal
        })

        if (!payOrderRes?.success || !payOrderRes.data) {
          throw new Error(payOrderRes?.message || 'Failed to initialize payment transaction')
        }

        const { razorpayOrderId, keyId } = payOrderRes.data

        const options = {
          key: keyId,
          amount: grandTotal * 100,
          currency: 'INR',
          name: 'MANODROP OS',
          description: 'Premium Intelligent Garment Care Checkout',
          order_id: razorpayOrderId,
          handler: async (response: any) => {
            try {
              // Verify transaction on Server
              const verifyRes = await apiClient.post<any>('/api/payments/verify', {
                razorpayOrderId: response.razorpay_order_id || razorpayOrderId,
                razorpayPaymentId: response.razorpay_payment_id || 'pay_mock_' + Date.now(),
                razorpaySignature: response.razorpay_signature || 'mock_signature',
              })

              if (verifyRes?.success) {
                toast.success('Payment completed & order confirmed!')
                clearCart()
                router.push(
                  `/dashboard/book/success?orderId=${orderId}&orderNumber=${orderNumber}&pickupDate=${pickupDate}&pickupTime=${encodeURIComponent(
                    pickupTimeSlot
                  )}&totalPaid=${grandTotal}`
                )
              } else {
                toast.error('Payment verification failed.')
              }
            } catch (err: any) {
              toast.error(err.message || 'Payment verification request failed')
            }
          },
          prefill: {
            name: user?.name || '',
            contact: user?.phone || '',
          },
          theme: {
            color: '#0C2340',
          }
        }

        // If local mock is active, trigger handler directly to simulate successful payment
        if (razorpayOrderId.startsWith('order_mock_')) {
          toast.info('Development Sandbox Mode: Simulating Razorpay Checkout Interface...')
          setTimeout(() => {
            options.handler({
              razorpay_order_id: razorpayOrderId,
              razorpay_payment_id: 'pay_mock_' + Date.now(),
              razorpay_signature: 'mock_signature'
            })
          }, 1500)
        } else {
          const rzp = new (window as any).Razorpay(options)
          rzp.open()
        }
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to complete checkout dispatch')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 text-left animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Checkout & Care Verification
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Establish secure dispatch address parameters, pickup timetables, and confirm treatment logistics.
          </p>
        </div>

        {/* Custom Progress Indicators */}
        <div className="flex items-center gap-2 text-xs font-bold shrink-0">
          <span className="px-3 py-1.5 rounded-lg border uppercase tracking-wider bg-white text-slate-500 border-slate-200">1. Select</span>
          <span className="text-slate-300">→</span>
          <span className="px-3 py-1.5 rounded-lg border uppercase tracking-wider bg-primary text-white border-primary shadow">2. Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Step Fields */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: Address Selection */}
          <Card variant="elevated" className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="text-primary w-5 h-5" />
                <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">1. Secure Dispatch Address</h2>
              </div>
              <Button size="sm" className="rounded-xl text-xs font-extrabold uppercase py-2 bg-slate-900 text-white hover:bg-slate-800" onClick={() => setIsModalOpen(true)}>
                Add Location
              </Button>
            </CardHeader>
            <CardBody className="p-6">
              {loadingAddresses ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin text-primary h-6 w-6" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-center space-y-2">
                  <p className="text-xs text-amber-800 font-bold">No saved dispatch locations. Please configure at least one address to continue.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col justify-between gap-3 relative ${
                        selectedAddressId === addr._id
                          ? 'border-accent bg-emerald-50/5 ring-1 ring-accent'
                          : 'border-slate-200/60 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-slate-900 text-sm">{addr.title}</p>
                          {addr.isDefault && (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full border">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold text-slate-400 leading-normal line-clamp-2">{addr.addressLine}</p>
                      </div>
                      {selectedAddressId === addr._id && (
                        <span className="absolute top-3 right-3 bg-accent text-slate-950 rounded-full p-0.5 shadow-sm">
                          <CheckCircle2 size={12} className="text-slate-950 fill-accent" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* STEP 2: Scheduling Preferances */}
          <Card variant="elevated" className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100 flex items-center gap-2">
              <Clock className="text-primary w-5 h-5" />
              <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">2. Pickup & Delivery Timing</h2>
            </CardHeader>
            <CardBody className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Pickup Setup */}
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Doorstep Collection Timing</h3>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 leading-none">Preferred Collection Date</label>
                    <input
                      type="date"
                      required
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 leading-none">Collection Hour Slot</label>
                    <select
                      required
                      value={pickupTimeSlot}
                      onChange={(e) => setPickupTimeSlot(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-xl text-xs font-bold text-slate-900 bg-white"
                    >
                      <option value="">Select Pickup Slot</option>
                      <option value="9:00 AM - 12:00 PM">Morning (9:00 AM - 12:00 PM)</option>
                      <option value="12:00 PM - 3:00 PM">Midday (12:00 PM - 3:00 PM)</option>
                      <option value="3:00 PM - 6:00 PM">Afternoon (3:00 PM - 6:00 PM)</option>
                      <option value="6:00 PM - 9:00 PM">Evening (6:00 PM - 9:00 PM)</option>
                    </select>
                  </div>
                </div>

                {/* Delivery Setup */}
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Pristine Delivery Timing</h3>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 leading-none">Delivered Back Date</label>
                    <input
                      type="date"
                      required
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 leading-none">Delivery Hour Slot</label>
                    <select
                      required
                      value={deliveryTimeSlot}
                      onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-xl text-xs font-bold text-slate-900 bg-white"
                    >
                      <option value="">Select Delivery Slot</option>
                      <option value="9:00 AM - 12:00 PM">Morning (9:00 AM - 12:00 PM)</option>
                      <option value="12:00 PM - 3:00 PM">Midday (12:00 PM - 3:00 PM)</option>
                      <option value="3:00 PM - 6:00 PM">Afternoon (3:00 PM - 6:00 PM)</option>
                      <option value="6:00 PM - 9:00 PM">Evening (6:00 PM - 9:00 PM)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 leading-none">
                  Special Fabric Handling & Safe-Drop Notes
                </label>
                <textarea
                  placeholder="Examples: treat sauce stain on white silk shirt, fold cotton trousers instead of hanging, safe drop behind planter..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-xl text-xs text-slate-900 font-bold"
                  rows={2}
                />
              </div>
            </CardBody>
          </Card>

          {/* STEP 3: Payment Configuration */}
          <Card variant="elevated" className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100 flex items-center gap-2">
              <CreditCard className="text-primary w-5 h-5" />
              <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">3. Payment Parameters</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col justify-between h-24 ${
                    paymentMethod === 'cod'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-slate-100 bg-white hover:border-primary/40'
                  }`}
                >
                  <span className="font-extrabold text-sm text-slate-900">Cash on Delivery (COD)</span>
                  <span className="text-[10px] font-semibold text-slate-500 leading-tight">Pay cash or scan QR code upon doorstep delivery.</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col justify-between h-24 ${
                    paymentMethod === 'razorpay'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-slate-100 bg-white hover:border-primary/40'
                  }`}
                >
                  <span className="font-extrabold text-sm text-slate-900">Secure Online Checkout</span>
                  <span className="text-[10px] font-semibold text-slate-500 leading-tight">Pay securely online using Cards, UPI, Netbanking or Wallets.</span>
                </button>
              </div>
            </CardBody>
          </Card>

        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <Card variant="elevated" className="border-2 border-primary/20 shadow-lg rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-5 border-b border-slate-100 bg-slate-50">
              <h2 className="text-base font-black uppercase tracking-wider text-slate-950">Care Dispatch Breakdown</h2>
            </CardHeader>
            <CardBody className="p-5 space-y-4">
              
              {/* Garment list review */}
              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <p className="text-xs font-bold text-slate-400 text-center py-4">No garments inside checkout cart.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.category} className="text-left space-y-1 border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-extrabold text-xs text-slate-900 leading-tight">{item.category}</p>
                          <p className="text-[9px] font-bold text-slate-500 capitalize mt-0.5">
                            {item.quantity} × ₹{item.price} ({SERVICES.find((s) => s.id === item.service)?.name || 'Wash Only'})
                          </p>
                        </div>
                        <p className="font-extrabold text-xs text-slate-950 shrink-0">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cost Calculations */}
              <div className="border-t border-slate-100 pt-3.5 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="text-slate-900 font-extrabold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Secure Dispatch Courier</span>
                  <span className="text-slate-900 font-extrabold">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Taxes (5% GST)</span>
                  <span className="text-slate-900 font-extrabold">₹{tax}</span>
                </div>

                {/* Promo Code selection */}
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Promotional Coupon</label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-2 rounded-xl text-[10px] font-bold text-emerald-800">
                      <div className="flex items-center gap-1.5">
                        <Tag size={12} className="text-accent" />
                        <span>{appliedCoupon.code} applied</span>
                      </div>
                      <button type="button" onClick={handleRemoveCoupon} className="text-red-500 hover:text-red-700">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="E.g. WELCOME10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-[10px] font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary w-full uppercase"
                      />
                      <Button size="sm" onClick={handleApplyCoupon} className="rounded-xl px-3 text-[10px] bg-slate-900 text-white font-bold hover:bg-slate-800 shrink-0">
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs font-semibold text-emerald-600">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm font-extrabold">
                  <span className="text-slate-900">Grand Total</span>
                  <span className="text-base text-accent">₹{grandTotal}</span>
                </div>
              </div>

            </CardBody>
            <CardFooter className="p-5 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
              <Button
                fullWidth
                onClick={triggerOrderCheckout}
                disabled={isSubmitting || items.length === 0}
                className="bg-gradient-to-r from-accent to-emerald-500 hover:from-emerald-500 hover:to-accent text-slate-950 font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-slate-950" />
                    Scheduling Dispatch...
                  </>
                ) : (
                  <>
                    <span>Confirm Dispatch Order</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </Button>
              <Button variant="secondary" fullWidth onClick={() => router.push('/dashboard/book')} disabled={isSubmitting} className="rounded-xl border-slate-200 font-bold py-2.5 flex items-center justify-center text-xs">
                <ChevronLeft size={14} className="mr-1" /> Browse More Garments
              </Button>
            </CardFooter>
          </Card>

          {/* Secure Note Card */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/60 flex gap-3 text-left">
            <ShieldCheck size={20} className="text-accent shrink-0 mt-0.5" />
            <p className="text-[10px] text-emerald-800 font-bold leading-normal">
              🛡️ Secure Smart Dispatch: Your custom smart beacon secure verification code will be generated instantly upon order confirmation to guarantee secure logistical transition.
            </p>
          </div>
        </div>
      </div>

      {/* Inline Add Address Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Saved Location">
        <form onSubmit={handleSaveAddress} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Location Tag / Title</label>
            <select
              value={addressFormData.title}
              onChange={(e) => setAddressFormData({ ...addressFormData, title: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-xl text-xs font-bold text-slate-900 bg-white"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <Input
            label="Full Address Line"
            placeholder="E.g., 402 Jade Crest, Prestige Tech Park, Bangalore"
            required
            value={addressFormData.addressLine}
            onChange={(e) => setAddressFormData({ ...addressFormData, addressLine: e.target.value })}
            className="border-slate-200 focus:ring-accent rounded-xl text-xs font-bold text-slate-900"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              step="0.0001"
              required
              value={addressFormData.latitude}
              onChange={(e) => setAddressFormData({ ...addressFormData, latitude: parseFloat(e.target.value) || 0 })}
              className="border-slate-200 focus:ring-accent rounded-xl text-xs font-bold text-slate-900"
            />
            <Input
              label="Longitude"
              type="number"
              step="0.0001"
              required
              value={addressFormData.longitude}
              onChange={(e) => setAddressFormData({ ...addressFormData, longitude: parseFloat(e.target.value) || 0 })}
              className="border-slate-200 focus:ring-accent rounded-xl text-xs font-bold text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="defaultAddressCheckboxReview"
              checked={addressFormData.isDefault}
              onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
              className="rounded text-accent focus:ring-accent"
            />
            <label htmlFor="defaultAddressCheckboxReview" className="text-[10px] font-extrabold text-slate-600 uppercase select-none">
              Set as default shipping drop
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 text-xs font-bold">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-white rounded-xl px-4 text-xs font-bold shadow-md">
              Save Location
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
