'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Logo } from '@/components/Logo'
import { Navbar } from '@/components/Navbar'
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Clock,
  Sparkles,
  Heart,
  Star,
  MapPin,
  ChevronRight,
  Send,
  Zap,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore()
  const [emailSub, setEmailSub] = useState('')

  const categories = [
    {
      id: 'wash_fold',
      title: 'Eco-Wash & Fold',
      desc: 'Soft washing utilizing premium organic detergents, allergen-free softeners, and impeccable hand-folding.',
      icon: '👕',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 'steam_press',
      title: 'Professional Steam Press',
      desc: 'Crisp wrinkle-free pressed finish utilizing vertical steam technology, delivered pristine on hangers.',
      icon: '👔',
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      id: 'dry_clean',
      title: 'Premium Dry Cleaning',
      desc: 'Expert care for luxury fabrics, suits, sarees, woolens, and heavy designer couture with zero harsh chemicals.',
      icon: '✨',
      color: 'bg-teal-50 text-teal-600 border-teal-100',
    },
    {
      id: 'restoration',
      title: 'Couture Restoration',
      desc: 'Advanced fabric stain removal, material conditioning, disinfection, and premium fabric preservation.',
      icon: '🧵',
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
  ]

  const metrics = [
    { value: 'Next Day', label: 'Average Turnaround Time' },
    { value: '99.99%', label: 'Garment Safety Rating' },
    { value: '50K+', label: 'Garments Processed' },
    { value: '24/7', label: 'Telemetry Support' },
  ]

  const testimonials = [
    {
      name: 'Aishwarya Sen',
      role: 'Fashion Designer',
      text: 'MANODROP handles my delicate embroidered silk sarees with absolute care. The luxury dry-cleaning is chemical-free and keeps colors incredibly vibrant.',
      avatar: '👩‍🎨',
      rating: 5,
    },
    {
      name: 'Rohan Malhotra',
      role: 'Corporate Consultant',
      text: 'Prsitine crisp shirts delivered perfectly on hangers using vertical steam press. I pre-schedule weekly pickups, and their smart courier handles the rest.',
      avatar: '👨‍💻',
      rating: 5,
    },
    {
      name: 'Nisha Gupta',
      role: 'Boutique Owner',
      text: 'Their fabric restoration is outstanding. They successfully removed an old red wine stain from a designer gown that others said was impossible!',
      avatar: '👩‍💼',
      rating: 5,
    },
  ]

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for subscribing to MANODROP Care updates!')
    setEmailSub('')
  }

  // Active Pricing Tab State
  const [activePricingTab, setActivePricingTab] = useState<'wash_fold' | 'steam_press' | 'dry_clean' | 'restoration'>('wash_fold')

  // Quantities State
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const pricingCategories = {
    wash_fold: {
      title: '👕 Eco Wash & Fold',
      subtitle: 'Premium organic wash, allergen-free softeners, and impeccable hand-folding.',
      icon: '👕',
      items: [
        { name: 'T-shirt / Top', price: 29 },
        { name: 'Jeans / Trousers', price: 39 },
        { name: 'Bed Sheets / Linens', price: 59 },
        { name: 'Undergarments', price: 19 },
        { name: 'Socks / Handkerchief', price: 9 }
      ]
    },
    steam_press: {
      title: '👔 Professional Steam Pressing',
      subtitle: 'Crisp wrinkle-free finish using multi-temperature vertical steam.',
      icon: '👔',
      items: [
        { name: 'Formal Shirt', price: 15 },
        { name: 'Formal Trousers', price: 15 },
        { name: 'Blazer / Jacket', price: 49 },
        { name: 'Saree / Ethnic Wear', price: 59 },
        { name: 'Designer Dress', price: 39 }
      ]
    },
    dry_clean: {
      title: '✨ Premium Dry Cleaning',
      subtitle: 'Expert non-toxic care for luxury fabrics, suits, sarees, and heavy designer couture.',
      icon: '✨',
      items: [
        { name: 'Suit (2-piece)', price: 249 },
        { name: 'Designer Silk Saree', price: 199 },
        { name: 'Winter Coat / Jacket', price: 299 },
        { name: 'Premium Leather Jacket', price: 499 },
        { name: 'Luxury Silk Dress', price: 179 }
      ]
    },
    restoration: {
      title: '🧵 Couture Restoration',
      subtitle: 'Advanced stain extraction, fabric conditioning, and material preservation.',
      icon: '🧵',
      items: [
        { name: 'Stain Extraction (Spot)', price: 99 },
        { name: 'Color Revitalization', price: 149 },
        { name: 'Advanced Fabric Conditioning', price: 79 },
        { name: 'Antimicrobial Sanitizing Wash', price: 49 }
      ]
    }
  }

  // Helper to update item quantity
  const updateQty = (itemName: string, change: number) => {
    setQuantities((prev) => {
      const current = prev[itemName] || 0
      const next = Math.max(0, current + change)
      const updated = { ...prev }
      if (next === 0) {
        delete updated[itemName]
      } else {
        updated[itemName] = next
      }
      return updated
    })
  }

  // Reset estimator helper
  const resetEstimator = () => {
    setQuantities({})
  }

  // Get selected items
  const selectedItems = Object.entries(quantities).map(([name, qty]) => {
    // Find the item price in the categories
    let price = 0
    for (const cat of Object.values(pricingCategories)) {
      const found = cat.items.find(i => i.name === name)
      if (found) {
        price = found.price
        break
      }
    }
    return { name, qty, price }
  }).filter(item => item.qty > 0)

  // Calculate estimated total
  const estimatedTotal = selectedItems.reduce((acc, curr) => acc + (curr.qty * curr.price), 0)

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-accent selection:text-white">
      {/* Dynamic Header / Navigation */}
      <Navbar />

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary via-[#0B1E36] to-slate-950 py-24 sm:py-36 text-white">
        {/* Abstract Background Highlights */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#10b981,transparent_45%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#34d399,transparent_35%)] opacity-10" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Tag/Badge / Welcome Greeting */}
            {user ? (
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-accent border border-accent/20 animate-fade-in">
                <Sparkles size={16} className="text-accent animate-pulse" />
                <span>Welcome back, {user.name}! ✨</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-accent border border-white/10">
                <Zap size={14} className="animate-bounce" />
                Smart IoT On-Demand Garment Care
              </div>
            )}

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-none text-white">
              Premium Fabric Care,<br />
              <span className="bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent">
                As You Desire.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed">
              Why wait? Get your garments washed, eco-dry cleaned, steam pressed, and beautifully restored. Instant doorstep pickup and smart beacon tracking built-in.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href={isAuthenticated ? '/dashboard' : '/auth/login'}>
                <Button size="lg" className="bg-gradient-to-r from-accent to-emerald-500 hover:from-emerald-500 hover:to-accent text-slate-950 font-bold px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.03] flex items-center justify-center">
                  Book Care Drop
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#services">
                <Button size="lg" variant="ghost" className="border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 rounded-2xl font-bold transition-all">
                  Explore Services
                  <Sparkles size={16} className="ml-2 text-accent" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Stacked Logo Display */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative p-12 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl max-w-sm w-full transition-transform duration-500 hover:rotate-2">
              <div className="absolute -top-3 -left-3 bg-accent text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-lg rotate-[-8deg] shadow-lg">
                PREMIUM GARMENT CARE
              </div>
              <Logo size="xl" lightMode={true} />
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Section */}
      <section id="metrics" className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {metrics.map((m, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-4xl sm:text-5xl font-black text-primary">{m.value}</p>
                <p className="text-sm font-semibold text-slate-500">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 sm:py-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Curated Garment Care Services
            </h2>
            <p className="text-lg text-slate-500">
              Professional, eco-conscious treatment for your daily essentials and luxury couture. 
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="group relative bg-white border border-slate-200/80 rounded-3xl p-8 hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Category icon container */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border ${cat.color} font-sans shadow-sm group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">{cat.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{cat.desc}</p>
                  </div>
                </div>

                <div className="pt-8 mt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">
                  <span>Explore Service</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefit Highlights (Wireless Smart Delivery Concept) */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right_bottom,#10b981,transparent_40%)] opacity-20" />
        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
              Eco-Care Facility & Wireless Dispatch Tracking
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Every order is assigned a smart IoT logistics code. Track your garments from doorstep pickup, through the washing/dry-cleaning cycle, quality checks, and final secure dropoff.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Impeccable Quality Assured',
                  desc: 'Every garment is individually inspected, color-sorted, and tagged to guarantee care specifications.',
                },
                {
                  icon: Truck,
                  title: 'Eco-Friendly Solvents Only',
                  desc: 'We use biodegradable detergents and soft eco-solvents that are gentle on fabrics and the planet.',
                },
                {
                  icon: Clock,
                  title: 'Telemetry Tracking Updates',
                  desc: 'Track your collection courier and check treatment progress in real-time down to the minute.',
                },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="bg-accent/15 w-12 h-12 rounded-xl flex items-center justify-center text-accent shrink-0">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white">{item.title}</h4>
                      <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex justify-center">
            {/* High-tech tracking graphic card */}
            <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent animate-ping" />
                  <span className="text-sm font-bold text-slate-200">Garment Facility Dispatched</span>
                </div>
                <span className="text-xs font-semibold text-slate-400">Dispatch ID: #MD-LC984</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Care Courier</span>
                  <span className="font-bold text-white">Vikram Rathore</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Dropoff ETA</span>
                  <span className="font-bold text-accent">11:42 AM (in 4 mins)</span>
                </div>
              </div>

              {/* Fake Map Layout */}
              <div className="h-44 bg-slate-900/60 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
                {/* Background grid representation */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:14px_24px]" />
                {/* Visual Route */}
                <svg className="absolute inset-0 w-full h-full">
                  <path d="M 50 140 Q 120 80, 240 100 T 360 40" stroke="#10b981" strokeWidth="4" fill="none" strokeDasharray="6 4" />
                </svg>
                {/* Source Dot */}
                <div className="absolute bottom-[20px] left-[50px] w-4 h-4 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                  <span className="text-[7px] font-bold text-white">F</span>
                </div>
                {/* Courier Moving Dot */}
                <div className="absolute top-[80px] left-[180px] bg-accent w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-xl animate-bounce">
                  <Truck size={14} className="text-slate-950" />
                </div>
                {/* Destination Dot */}
                <div className="absolute top-[30px] right-[40px] w-5 h-5 bg-accent rounded-full border-2 border-white flex items-center justify-center shadow-xl">
                  <MapPin size={10} className="text-slate-950" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Interactive Estimator Section */}
      <section id="pricing" className="py-24 sm:py-32 bg-slate-50 border-t border-slate-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-primary border border-primary/10">
              Transparent Pay-Per-Piece Pricing
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Honest Pricing. Zero Commitments.
            </h2>
            <p className="text-lg text-slate-500">
              No locked-in monthly subscriptions. Pay only for the garments you need cleaned. Use our live estimator to calculate your order cost instantly!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
            {/* Left Column: Interactive Tabbed Service Catalog */}
            <div className="lg:col-span-7 space-y-8">
              {/* Category Tab Selectors */}
              <div className="flex bg-slate-200/60 p-1.5 rounded-2xl gap-1">
                {Object.entries(pricingCategories).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setActivePricingTab(key as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all ${
                      activePricingTab === key
                        ? 'bg-white text-slate-950 shadow-md font-extrabold scale-[1.02]'
                        : 'text-slate-600 hover:bg-white/45'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="hidden sm:inline">{cat.title.split(' ').slice(1).join(' ') || cat.title}</span>
                  </button>
                ))}
              </div>

              {/* Active Tab Headings */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <span className="text-3xl bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center">
                    {pricingCategories[activePricingTab].icon}
                  </span>
                  {pricingCategories[activePricingTab].title}
                </h3>
                <p className="text-slate-500 text-sm font-medium">
                  {pricingCategories[activePricingTab].subtitle}
                </p>
              </div>

              {/* Items List */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm divide-y divide-slate-100">
                {pricingCategories[activePricingTab].items.map((item) => {
                  const qty = quantities[item.name] || 0
                  return (
                    <div key={item.name} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm font-bold text-primary">₹{item.price} <span className="text-slate-400 font-medium">/ piece</span></p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 p-1 rounded-xl">
                        <button
                          onClick={() => updateQty(item.name, -1)}
                          disabled={qty === 0}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200/80 transition-colors ${
                            qty === 0 ? 'opacity-30 cursor-not-allowed' : ''
                          }`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-black text-slate-950">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.name, 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200/80 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column: Sticky Estimator & Summary */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <Card variant="elevated" className="border border-slate-200 rounded-3xl shadow-lg bg-white overflow-hidden relative">
                {/* Visual Header */}
                <div className="bg-gradient-to-r from-primary via-[#0B1E36] to-slate-950 text-white p-6 relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_right_bottom,#10b981,transparent_55%)] opacity-30" />
                  <div className="relative z-10 space-y-1">
                    <h3 className="text-xl font-black">Live Order Estimator</h3>
                    <p className="text-xs text-slate-300">Add garments to view estimated total cost</p>
                  </div>
                </div>

                <CardBody className="p-6 space-y-6">
                  {selectedItems.length === 0 ? (
                    <div className="py-12 text-center space-y-3">
                      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 text-2xl">
                        🛒
                      </div>
                      <p className="text-sm font-bold text-slate-400">Your estimator is empty</p>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">Select a category and increase item quantities to begin building your custom order estimate.</p>
                    </div>
                  ) : (
                    <>
                      {/* Selected Items Breakdown */}
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {selectedItems.map((item) => {
                          const qty = quantities[item.name] || 0
                          return (
                            <div key={item.name} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQty(item.name, -qty)}
                                  className="text-slate-400 hover:text-red-500 transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 size={13} />
                                </button>
                                <span className="font-semibold text-slate-800">{item.name}</span>
                              </div>
                              <span className="font-bold text-slate-950">
                                {qty} × ₹{item.price} = ₹{qty * item.price}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Calculations breakdown */}
                      <div className="space-y-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="text-slate-800">₹{estimatedTotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Home Pickup & Delivery</span>
                          <span className="text-accent bg-accent/15 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10px]">FREE</span>
                        </div>
                      </div>

                      {/* Estimated Total */}
                      <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Total</p>
                          <p className="text-3xl font-black text-slate-950">₹{estimatedTotal}</p>
                        </div>
                        <button
                          onClick={resetEstimator}
                          className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline transition-colors uppercase tracking-wider"
                        >
                          Clear All
                        </button>
                      </div>

                      {/* Book CTA */}
                      <Link href={isAuthenticated ? '/dashboard' : '/auth/login'}>
                        <Button
                          fullWidth
                          size="lg"
                          className="bg-gradient-to-r from-accent to-emerald-500 hover:from-emerald-500 hover:to-accent text-slate-950 font-black py-4 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center uppercase tracking-wider text-sm mt-2 font-sans"
                        >
                          Book Care Drop Now
                          <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </Link>
                    </>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section id="testimonials" className="py-24 sm:py-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Endorsed by Fabric Enthusiasts
            </h2>
            <p className="text-lg text-slate-500">
              Discover what our active members say about their MANODROP garment care experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <Card key={idx} variant="elevated" className="border border-slate-100 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300">
                <CardBody className="space-y-6 p-8 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    {/* Stars */}
                    <div className="flex gap-1">
                      {Array.from({ length: test.rating }).map((_, sIdx) => (
                        <Star key={sIdx} size={16} className="fill-accent stroke-accent" />
                      ))}
                    </div>
                    <p className="text-slate-700 italic leading-relaxed">"{test.text}"</p>
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                    <span className="text-4xl bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center">{test.avatar}</span>
                    <div>
                      <p className="font-bold text-slate-950">{test.name}</p>
                      <p className="text-xs font-semibold text-slate-500">{test.role}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Newsletter */}
      <section className="bg-gradient-to-br from-primary via-[#0B1E36] to-slate-950 py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_bottom,#10b981,transparent_35%)] opacity-20" />
        <div className="container-custom relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
            Your Garments Cared For. FLAWLESSLY.
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Ready to experience on-demand smart garment care? Sign up in seconds, get your first express pickup scheduled immediately, and enjoy the speed.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4 justify-center">
            <Link href={isAuthenticated ? '/dashboard' : '/auth/login'}>
              <Button size="lg" className="bg-gradient-to-r from-accent to-emerald-500 hover:from-emerald-500 hover:to-accent text-slate-950 font-bold px-8 py-4 rounded-xl shadow-lg transition-all">
                Schedule First Pickup
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/5">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-white font-extrabold mb-5 uppercase tracking-wide text-sm">Couture Care</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="#services" className="hover:text-accent transition-colors">Eco Wash & Fold</Link></li>
                <li><Link href="#services" className="hover:text-accent transition-colors">Steam Pressing</Link></li>
                <li><Link href="#services" className="hover:text-accent transition-colors">Luxury Dry Clean</Link></li>
                <li><Link href="#services" className="hover:text-accent transition-colors">Fabric Restoration</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-extrabold mb-5 uppercase tracking-wide text-sm">Logistics</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-accent transition-colors">Garment Dispatch Hubs</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Eco-Fleet GPS Routing</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Carrier Application</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Smart Beacon Protocols</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-extrabold mb-5 uppercase tracking-wide text-sm">Company</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-accent transition-colors">About Our Brand</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Press Room</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Sustainability Guarantee</Link></li>
              </ul>
            </div>
            <div className="space-y-5">
              <h3 className="text-white font-extrabold uppercase tracking-wide text-sm">Get Latest Updates</h3>
              <p className="text-xs leading-relaxed text-slate-500">Subscribe for early service launches, discounts, and fabric care tips.</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  required
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent w-full"
                />
                <button type="submit" className="bg-accent text-slate-950 p-2.5 rounded-lg hover:bg-emerald-400 transition-colors">
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div className="flex items-center gap-4">
              <Logo size="sm" showText={true} lightMode={true} />
            </div>
            <p>&copy; {new Date().getFullYear()} MANODROP Care Logistics. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
