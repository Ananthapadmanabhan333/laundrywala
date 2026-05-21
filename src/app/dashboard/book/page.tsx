'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card'
import { useCartStore } from '@/store/cart'
import { Plus, Minus, Trash2, ChevronRight, ShoppingCart, ShieldCheck, Clock, MapPin, ChevronLeft } from 'lucide-react'
import { toast } from 'react-toastify'

const MEN_ITEMS = [
  { id: 'm_shirt', name: 'Premium Shirt', icon: '👔', price: 30 },
  { id: 'm_tshirt', name: 'Cotton T-Shirt', icon: '👕', price: 20 },
  { id: 'm_trouser', name: 'Trouser / Jeans', icon: '👖', price: 40 },
  { id: 'm_blazer', name: 'Designer Blazer', icon: '🧥', price: 100 },
  { id: 'm_suit', name: 'Full Suit (2pc)', icon: '💼', price: 180 },
  { id: 'm_jacket', name: 'Heavy Jacket', icon: '🧥', price: 120 },
]

const WOMEN_ITEMS = [
  { id: 'w_saree', name: 'Designer Silk Saree', icon: '🧵', price: 80 },
  { id: 'w_gown', name: 'Evening Gown', icon: '👗', price: 120 },
  { id: 'w_suit', name: 'Salwar Suit (Set)', icon: '🥻', price: 60 },
  { id: 'w_blouse', name: 'Couture Blouse', icon: '👚', price: 30 },
  { id: 'w_skirt', name: 'Skirt / Designer Top', icon: '👗', price: 40 },
  { id: 'w_shawl', name: 'Pashmina Shawl', icon: '🧣', price: 70 },
]

const ESSENTIAL_ITEMS = [
  { id: 'e_hoodie', name: 'Casual Hoodie', icon: '🧥', price: 60 },
  { id: 'e_socks', name: 'Woolen Socks (Pair)', icon: '🧦', price: 15 },
  { id: 'e_activewear', name: 'Activewear Tops', icon: '🎽', price: 30 },
  { id: 'e_towel', name: 'Plush Bath Towel', icon: '🧼', price: 35 },
  { id: 'e_handker', name: 'Handkerchief', icon: '⬜', price: 5 },
  { id: 'e_innerwear', name: 'Premium Undergarments', icon: '🩲', price: 15 },
]

const HOUSEHOLD_ITEMS = [
  { id: 'h_sheet', name: 'Bed Sheet (Double)', icon: '🛏️', price: 90 },
  { id: 'h_pillow', name: 'Pillow Cover', icon: '⬜', price: 20 },
  { id: 'h_duvet', name: 'Duvet / Heavy Blanket', icon: '🛌', price: 150 },
  { id: 'h_curtain', name: 'Curtain (Per Panel)', icon: '🪟', price: 80 },
  { id: 'h_mat', name: 'Plush Bath Mat', icon: '🧼', price: 35 },
  { id: 'h_cushion', name: 'Cushion Cover', icon: '⏹️', price: 15 },
]

const SERVICES = [
  { id: 'wash', name: 'Wash Only', description: 'Eco-clean standard soft wash', priceMultiplier: 1.0 },
  { id: 'wash_iron', name: 'Wash + Iron', description: 'Cleaned and premium pressed', priceMultiplier: 1.5 },
  { id: 'dry_clean', name: 'Dry Clean', description: 'Professional expert organic dry clean', priceMultiplier: 2.0 },
  { id: 'premium', name: 'Couture Restoration', description: 'Intensive restoration & sanitizer care', priceMultiplier: 2.5 },
]

export default function BookLaundryPage() {
  const router = useRouter()
  const { items, addItem, removeItem, updateItem, clearCart } = useCartStore()
  const [activeTab, setActiveTab] = useState<'men' | 'women' | 'essentials' | 'household'>('men')
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string; price: number; icon: string } | null>(null)
  const [selectedService, setSelectedService] = useState<string>('wash_iron')
  const [quantity, setQuantity] = useState(1)
  const [step, setStep] = useState<'select' | 'cart' | 'schedule'>('select')

  // Slots & Inputs
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliverySlot, setDeliverySlot] = useState('')
  const [notes, setNotes] = useState('')

  const currentItems = {
    men: MEN_ITEMS,
    women: WOMEN_ITEMS,
    essentials: ESSENTIAL_ITEMS,
    household: HOUSEHOLD_ITEMS,
  }[activeTab]

  const handleItemClick = (item: { id: string; name: string; price: number; icon: string }) => {
    setSelectedItem(item)
    setQuantity(1)
  }

  const handleAddToCart = () => {
    if (!selectedItem) return

    const basePrice = selectedItem.price
    const serviceMultiplier = SERVICES.find((s) => s.id === selectedService)?.priceMultiplier || 1
    const price = Math.round(basePrice * serviceMultiplier)

    addItem({
      category: `${selectedItem.icon} ${selectedItem.name}`,
      quantity,
      service: selectedService as any,
      price,
    })

    setSelectedItem(null)
    setQuantity(1)
    toast.success('Garment added to your MANODROP checkout!')
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getActiveTabTitle = () => {
    return {
      men: "Men's Couture",
      women: "Women's Couture",
      essentials: "Daily Essentials",
      household: "Household & Linens",
    }[activeTab]
  }

  const triggerPayment = () => {
    if (!pickupDate || !pickupTime || !deliveryDate || !deliverySlot) {
      toast.error('Please specify both collection and dropoff slot preferences.')
      alert('Please fill out all schedule options before proceeding.')
      return
    }

    alert('Care Dispatch created successfully! Redirecting you to secure payment gateway.')
    clearCart()
    router.push('/dashboard/orders')
  }

  return (
    <div className="space-y-8 text-left animate-fade-in">
      {/* Header and Step Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {step === 'select' && 'Schedule Garment Care'}
            {step === 'cart' && 'Verify Care Drops'}
            {step === 'schedule' && 'Secure Telemetry Pickup'}
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            {step === 'select' && 'Select your garment segment, treatment level, and add them to your checkout list.'}
            {step === 'cart' && 'Verify your selected treatments prior to logistics scheduling.'}
            {step === 'schedule' && 'Configure pickup date, doorstep dropoff slots, and safe handling instructions.'}
          </p>
        </div>

        {/* Custom Progress Badges */}
        <div className="flex items-center gap-2 text-xs font-bold shrink-0">
          <span className={`px-3 py-1.5 rounded-lg border uppercase tracking-wider ${step === 'select' ? 'bg-primary text-white border-primary shadow' : 'bg-white text-slate-500 border-slate-200'}`}>1. Select</span>
          <span className="text-slate-300">→</span>
          <span className={`px-3 py-1.5 rounded-lg border uppercase tracking-wider ${step === 'cart' ? 'bg-primary text-white border-primary shadow' : 'bg-white text-slate-500 border-slate-200'}`}>2. Review</span>
          <span className="text-slate-300">→</span>
          <span className={`px-3 py-1.5 rounded-lg border uppercase tracking-wider ${step === 'schedule' ? 'bg-primary text-white border-primary shadow' : 'bg-white text-slate-500 border-slate-200'}`}>3. Schedule</span>
        </div>
      </div>

      {step === 'select' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Shopping selection Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Category selection Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
              {[
                { id: 'men', name: "Men's Couture", icon: '👔' },
                { id: 'women', name: "Women's Couture", icon: '🧵' },
                { id: 'essentials', name: 'Daily Essentials', icon: '🧥' },
                { id: 'household', name: 'Household Linens', icon: '🛏️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any)
                    setSelectedItem(null)
                  }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold tracking-wide transition-all uppercase border ${
                    activeTab === tab.id
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>

            {/* Shopping selection Card Grid */}
            <Card variant="elevated" className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-slate-900">{getActiveTabTitle()} Items</h2>
                <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-wider">Fabric Care Active</span>
              </CardHeader>
              <CardBody className="p-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {currentItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`p-5 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-center space-y-3 relative ${
                        selectedItem?.id === item.id
                          ? 'border-accent bg-accent/5 ring-1 ring-accent'
                          : 'border-slate-100 bg-white hover:border-accent/40'
                      }`}
                    >
                      <div className="text-4xl bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center shadow-inner">{item.icon}</div>
                      <div className="space-y-1">
                        <p className="font-extrabold text-sm text-slate-900 leading-tight">{item.name}</p>
                        <p className="text-xs font-extrabold text-accent">₹{item.price} base</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Sub Options detail drawer when an item is selected */}
                {selectedItem && (
                  <div className="border-t border-slate-100 pt-6 space-y-6 animate-fade-in">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl shrink-0">{selectedItem.icon}</span>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Fabric</p>
                          <h4 className="font-extrabold text-lg text-slate-900 leading-tight">{selectedItem.name}</h4>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Base Unit Rate</p>
                        <p className="font-black text-xl text-accent">₹{selectedItem.price}</p>
                      </div>
                    </div>

                    {/* Services Options - Laundry Care Only */}
                    <div className="space-y-3">
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                        Select Care Treatment Level
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {SERVICES.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => setSelectedService(service.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col justify-between h-26 ${
                              selectedService === service.id
                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                : 'border-slate-100 bg-white hover:border-primary/40'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <p className="font-bold text-sm text-slate-900">{service.name}</p>
                              <p className="text-[10px] font-semibold text-slate-500 leading-tight">{service.description}</p>
                            </div>
                            <p className="text-xs font-black text-primary uppercase mt-1">×{service.priceMultiplier} rate</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity selectors */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                      <div className="space-y-2">
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 leading-none">
                          Garment Quantity
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center justify-center text-slate-700 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 h-10 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-accent rounded-lg text-center font-bold text-slate-900"
                          />
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center justify-center text-slate-700 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="sm:w-64">
                        <Button
                          onClick={handleAddToCart}
                          fullWidth
                          size="lg"
                          className="bg-gradient-to-r from-accent to-emerald-500 hover:from-emerald-500 hover:to-accent text-slate-950 font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          <ShoppingCart size={18} />
                          Add to Dispatch
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Quick Cart Summary View */}
          <div className="lg:col-span-4 sticky top-24">
            <Card variant="elevated" className="border-2 border-primary/20 shadow-lg rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-primary text-white p-5">
                <div className="flex items-center gap-2.5">
                  <ShoppingCart size={20} className="text-accent" />
                  <h2 className="text-base font-black uppercase tracking-wider">Care Dispatch Cart</h2>
                </div>
              </CardHeader>
              <CardBody className="p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-12 space-y-2">
                    <ShoppingCart size={32} className="mx-auto text-slate-200" />
                    <p className="text-sm font-bold text-slate-400">No garments selected</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.category} className="space-y-2 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-extrabold text-sm text-slate-900 leading-tight">{item.category}</p>
                            <p className="text-[10px] font-bold text-slate-500 capitalize mt-0.5">
                              {SERVICES.find((s) => s.id === item.service)?.name || 'Wash & Press'}
                            </p>
                          </div>
                          <p className="font-extrabold text-sm text-slate-900">₹{item.price * item.quantity}</p>
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg border border-slate-100/50">
                          <button
                            onClick={() =>
                              updateItem(item.category, { ...item, quantity: Math.max(1, item.quantity - 1) })
                            }
                            className="p-1 hover:bg-slate-200 rounded text-slate-500"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-bold text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => updateItem(item.category, { ...item, quantity: item.quantity + 1 })}
                            className="p-1 hover:bg-slate-200 rounded text-slate-500"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removeItem(item.category)}
                            className="p-1 hover:bg-red-50 text-red-500 rounded ml-auto"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
              <CardFooter className="bg-slate-50 p-5 border-t border-slate-100 flex flex-col gap-4">
                <div className="flex justify-between items-center text-base font-extrabold text-slate-950 w-full">
                  <span>Care Total:</span>
                  <span className="text-xl text-accent">₹{calculateSubtotal()}</span>
                </div>
                <Button
                  fullWidth
                  onClick={() => setStep('cart')}
                  disabled={items.length === 0}
                  className="bg-gradient-to-r from-accent to-emerald-500 hover:from-emerald-500 hover:to-accent text-slate-950 font-bold py-3.5 rounded-xl shadow transition-all flex items-center justify-center"
                >
                  Verify Care Details <ChevronRight size={18} className="ml-1.5" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {step === 'cart' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <Card variant="elevated" className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100">
                <h2 className="text-lg font-extrabold text-slate-900">Verify Selected Garments</h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.category} className="flex justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">{item.category}</p>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                          {item.quantity} items × ₹{item.price} ({SERVICES.find((s) => s.id === item.service)?.name || 'Wash & Press'})
                        </p>
                      </div>
                      <p className="font-black text-slate-950 text-base">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-4 sticky top-24">
            <Card variant="elevated" className="border border-slate-200 shadow-lg rounded-3xl overflow-hidden bg-white">
              <CardHeader className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-base font-black uppercase tracking-wider text-slate-950">Care Fee Breakdown</h2>
              </CardHeader>
              <CardBody className="p-6 space-y-4">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-500">Care Subtotal</span>
                  <span className="text-slate-900">₹{calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-500">Secure Dispatch Courier</span>
                  <span className="text-slate-900">₹49</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-500">Taxes (5% GST)</span>
                  <span className="text-slate-900">₹{Math.round(calculateSubtotal() * 0.05)}</span>
                </div>
                <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-base font-extrabold">
                  <span className="text-slate-900">Grand Total</span>
                  <span className="text-xl text-accent">₹{calculateSubtotal() + 49 + Math.round(calculateSubtotal() * 0.05)}</span>
                </div>
              </CardBody>
              <CardFooter className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <Button variant="secondary" fullWidth onClick={() => setStep('select')} className="rounded-xl border-slate-200 font-bold py-3">
                  <ChevronLeft size={16} className="mr-1.5" /> Back
                </Button>
                <Button
                  fullWidth
                  onClick={() => setStep('schedule')}
                  className="bg-gradient-to-r from-accent to-emerald-500 hover:from-emerald-500 hover:to-accent text-slate-950 font-bold py-3 rounded-xl shadow transition-all"
                >
                  Scheduling
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {step === 'schedule' && (
        <div className="max-w-3xl mx-auto animate-fade-in">
          <Card variant="elevated" className="border border-slate-100 shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-900">Configure Secure Dispatch Schedulers</h2>
            </CardHeader>
            <CardBody className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">Preferred Collection Date</label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">Collection Hour Slot</label>
                  <input
                    type="time"
                    required
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">Delivered Back Date</label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">Dropoff Slot Selection</label>
                  <select
                    required
                    value={deliverySlot}
                    onChange={(e) => setDeliverySlot(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-xl text-sm font-bold text-slate-900 bg-white"
                  >
                    <option value="">Choose Time Slot</option>
                    <option>Morning Dispatch (9:00 AM - 12:00 PM)</option>
                    <option>Midday Dispatch (12:00 PM - 3:00 PM)</option>
                    <option>Afternoon Dispatch (3:00 PM - 6:00 PM)</option>
                    <option>Night drop Dispatch (6:00 PM - 9:00 PM)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Special Fabric Handling / Safe-Drop instructions
                </label>
                <textarea
                  placeholder="E.g., Treat coffee stains on red blazer, fold silk saree instead of hanging, safe drop behind planter..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-xl text-sm text-slate-900 font-medium"
                  rows={3}
                />
              </div>

              {/* Informational notification card */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-3">
                <ShieldCheck size={20} className="text-accent shrink-0 mt-0.5 animate-pulse" />
                <p className="text-xs text-emerald-800 font-bold leading-relaxed">
                  🛡️ Secure Smart Dispatch: Your garment collection courier will verify the dispatch shipment utilizing your wireless smart beacon code upon arrival.
                </p>
              </div>
            </CardBody>
            <CardFooter className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
              <Button variant="secondary" fullWidth onClick={() => setStep('cart')} className="rounded-xl border-slate-200 font-bold py-3.5">
                <ChevronLeft size={16} className="mr-1.5" /> Back
              </Button>
              <Button
                fullWidth
                onClick={triggerPayment}
                className="bg-gradient-to-r from-accent to-emerald-500 hover:from-emerald-500 hover:to-accent text-slate-950 font-bold py-3.5 rounded-xl shadow-lg transition-all"
              >
                Schedule Doorstep Collection
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
