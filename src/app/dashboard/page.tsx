'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { useAuthStore } from '@/store/auth'
import {
  Plus,
  Clock,
  CheckCircle,
  TrendingUp,
  ShoppingBag,
  Zap,
  ArrowRight,
  HelpCircle,
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuthStore()

  const recentOrders = [
    {
      id: '1',
      orderNumber: '#MND-8942',
      date: '2026-05-21',
      status: 'delivered',
      total: 1798,
      items: '3× Shirts (Steam Press), 1× Blazer (Dry Clean)',
      type: 'Couture Drop',
    },
    {
      id: '2',
      orderNumber: '#MND-7713',
      date: '2026-05-20',
      status: 'in_wash',
      total: 1547,
      items: '1× Hoodie (Standard Wash), 1× Silk Saree (Dry Clean)',
      type: 'Premium Care',
    },
  ]

  const stats = [
    {
      label: 'Active Care Dispatches',
      value: '1',
      icon: Clock,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      label: 'Total Cleaned Garments',
      value: '28',
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Fabric Eco-Points',
      value: '1,430 XP',
      icon: TrendingUp,
      color: 'from-accent to-emerald-500',
    },
  ]

  const categories = [
    {
      title: 'Eco Wash & Fold',
      desc: 'Eco-clean standard soft wash & impeccable folds.',
      icon: '👕',
      link: '/dashboard/book',
      color: 'border-emerald-100 hover:border-emerald-300',
      badge: 'Same Day Pickup',
    },
    {
      title: 'Wrinkle-Free Steam Press',
      desc: 'Premium vertical steam ironing, delivered on hangers.',
      icon: '👔',
      link: '/dashboard/book',
      color: 'border-blue-100 hover:border-blue-300',
      badge: 'Express Press',
    },
    {
      title: 'Delicate Dry Cleaning',
      desc: 'Expert chemical-free dry clean for designer couture.',
      icon: '✨',
      link: '/dashboard/book',
      color: 'border-teal-100 hover:border-teal-300',
      badge: 'Expert Quality',
    },
    {
      title: 'Couture Restoration',
      desc: 'Intensive stain removal & meticulous fabric conditioning.',
      icon: '🧵',
      link: '/dashboard/book',
      color: 'border-amber-100 hover:border-amber-300',
      badge: 'Specialty Care',
    },
  ]

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      pending: { bg: 'bg-amber-50 text-amber-800 border-amber-100', text: 'Awaiting Pickup' },
      in_wash: { bg: 'bg-blue-50 text-blue-800 border-blue-100', text: 'Undergoing Care' },
      delivered: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-100', text: 'Securely Delivered' },
      cancelled: { bg: 'bg-red-50 text-red-800 border-red-100', text: 'Voided' },
    }
    return badges[status] || { bg: 'bg-slate-50 text-slate-800 border-slate-100', text: 'Active Telemetry' }
  }

  return (
    <div className="space-y-8 text-left animate-fade-in">
      {/* Welcome Section Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-primary/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,#10b981,transparent_55%)] opacity-35" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
              Welcome back, {user?.name || 'Ananthapadmanabhan'}! 👋
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg font-medium leading-relaxed">
              Schedule doorstep collections, monitor live telemetry care cycles, and get your garments back in pristine state.
            </p>
          </div>

          <Link href="/dashboard/book">
            <Button className="bg-gradient-to-r from-accent to-emerald-500 hover:from-emerald-500 hover:to-accent text-slate-950 font-bold px-6 py-3.5 rounded-2xl shadow-xl transition-all flex items-center gap-2 shrink-0">
              <Plus size={18} />
              Book Care Drop
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} variant="elevated" className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white">
              <CardBody className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 leading-none pt-1">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} p-3.5 rounded-2xl shadow-inner text-white`}>
                  <Icon size={20} />
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>

      {/* Main Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Garment Care Categories</h2>
          <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-wider">Smart Dispatch Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link href={cat.link} key={idx} className="group">
              <div className={`h-full bg-white border ${cat.color} rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col justify-between space-y-4`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{cat.icon}</span>
                    <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-primary transition-colors">{cat.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{cat.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-accent transition-colors">
                  <span>Schedule Now</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders List */}
        <div className="lg:col-span-8">
          <Card variant="elevated" className="border border-slate-100 rounded-3xl shadow-sm bg-white">
            <CardHeader className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Care Dispatches</h2>
                  <p className="text-xs font-semibold text-slate-500">Track and manage your active garment logs</p>
                </div>
                <Link href="/dashboard/orders">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 font-bold">
                    View Complete Log
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardBody className="p-6">
              {recentOrders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ShoppingBag size={40} className="mx-auto text-slate-300" />
                  <p className="text-slate-500 font-semibold">No active collections found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => {
                    const badge = getStatusBadge(order.status)
                    return (
                      <div
                        key={order.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-2xl hover:shadow-sm hover:border-slate-200 transition-all gap-4 bg-white"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-950 text-sm">{order.orderNumber}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase border border-slate-200">
                              {order.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-semibold line-clamp-1">{order.items}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{order.date}</p>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2">
                          <p className="font-black text-slate-950 text-base">₹{order.total}</p>
                          <span
                            className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border leading-none ${badge.bg}`}
                          >
                            {badge.text}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Priority Help Cards */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="elevated" className="border border-slate-100 rounded-3xl shadow-sm bg-sage/35 overflow-hidden relative">
            <CardBody className="p-6 space-y-4">
              <div className="bg-accent/15 w-10 h-10 rounded-xl flex items-center justify-center text-accent">
                <Zap size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">Immediate Care Support</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Our garment care technicians are available 24/7. Ask questions about premium fabrics.
                </p>
              </div>
              <Button fullWidth className="bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl text-xs py-3">
                Chat Fabric Specialist
              </Button>
            </CardBody>
          </Card>

          <Card variant="elevated" className="border border-slate-100 rounded-3xl shadow-sm bg-white">
            <CardBody className="p-6 space-y-4">
              <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                <HelpCircle size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">Garment FAQ</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  How does smart-beacon secure pickup work? Read details about safe-drops.
                </p>
              </div>
              <Link href="#" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-accent uppercase tracking-wider">
                Browse Care FAQ
                <ArrowRight size={12} />
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
