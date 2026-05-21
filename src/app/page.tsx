'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { Logo } from '@/components/Logo'
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
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export default function HomePage() {
  const { isAuthenticated } = useAuthStore()
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

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-accent selection:text-white">
      {/* Dynamic Header / Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="container-custom flex items-center justify-between py-4">
          <Link href="/">
            <Logo size="md" />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="#services" className="hover:text-primary transition-colors">Garment Services</Link>
            <Link href="#metrics" className="hover:text-primary transition-colors">Why MANODROP</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Subscriptions</Link>
            <Link href="#testimonials" className="hover:text-primary transition-colors">Reviews</Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-primary hover:bg-primary/95 text-white font-semibold shadow-md px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5">
                  User Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-bold text-slate-700 hover:text-primary transition-colors px-4 py-2">
                  Sign In
                </Link>
                <Link href="/auth/login">
                  <Button size="sm" className="bg-gradient-to-r from-primary via-slate-900 to-primary hover:from-primary hover:to-accent text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5">
                    Schedule Pickup
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary via-[#0B1E36] to-slate-950 py-24 sm:py-36 text-white">
        {/* Abstract Background Highlights */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#10b981,transparent_45%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#34d399,transparent_35%)] opacity-10" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Tag/Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-accent border border-white/10">
              <Zap size={14} className="animate-bounce" />
              Smart IoT On-Demand Garment Care
            </div>

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

      {/* Pricing / Delivery Packages */}
      <section id="pricing" className="py-24 sm:py-32 bg-slate-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Garment Care Subscriptions
            </h2>
            <p className="text-lg text-slate-500">
              Select a specialized plan to secure prioritized collections, dedicated hangers, and zero peak-hour surcharges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Eco Essential',
                price: '₹29',
                period: 'per garment',
                features: ['Standard next-day turnaround', 'Soft machine-wash & detailed fold', 'Standard eco-detergents included', 'SMS alert notifications'],
                popular: false,
                buttonText: 'Pay per Order',
              },
              {
                title: 'MANODROP Gold Care',
                price: '₹999',
                period: 'per month',
                features: ['Unlimited free collections', 'Guaranteed priority 12-hr express', 'Up to 30 free hanger pressing drops', '15% discount on luxury dry cleans'],
                popular: true,
                buttonText: 'Join Gold Care',
              },
              {
                title: 'Couture Suite',
                price: '₹2499',
                period: 'per month',
                features: ['Unlimited free collections', 'Pre-scheduled weekly collection slot', 'Specialized white-glove logistics', 'Personal garment technician advisor'],
                popular: false,
                buttonText: 'Subscribe to Couture Suite',
              },
            ].map((plan, idx) => (
              <Card
                key={idx}
                variant={plan.popular ? 'elevated' : 'default'}
                className={`flex flex-col justify-between border-2 rounded-3xl p-4 transition-all duration-300 ${
                  plan.popular
                    ? 'border-accent bg-white shadow-xl scale-105'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <CardBody className="space-y-6">
                  {plan.popular && (
                    <span className="inline-block bg-accent text-slate-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                      Most Selected Suite
                    </span>
                  )}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-950">{plan.title}</h3>
                    <div>
                      <span className="text-4xl font-extrabold text-slate-950">{plan.price}</span>
                      <span className="text-sm font-semibold text-slate-500 ml-1.5">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 border-t border-slate-100 pt-6">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                        <div className="bg-accent/15 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-[10px] text-accent font-black">✓</span>
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </CardBody>
                <div className="p-6 pt-0 mt-6">
                  <Button
                    fullWidth
                    className={`rounded-2xl py-3.5 font-bold transition-all text-sm uppercase tracking-wide ${
                      plan.popular
                        ? 'bg-gradient-to-r from-accent to-emerald-500 hover:from-emerald-500 hover:to-accent text-slate-950 shadow-md hover:-translate-y-0.5'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              </Card>
            ))}
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
