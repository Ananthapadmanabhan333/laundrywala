'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/Button'
import { Menu, X, LogOut, Home, ShoppingBag, Clock, Settings, User } from 'lucide-react'
import { Logo } from '@/components/Logo'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading, logout } = useAuthStore()
  const { items: cartItems } = useCartStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [mounted, isAuthenticated, isLoading, router])

  const handleLogout = () => {
    logout()
    localStorage.removeItem('authToken')
    router.push('/auth/login')
  }

  const menuItems = [
    { name: 'Dashboard Hub', href: '/dashboard', icon: Home },
    { name: 'Place Order', href: '/dashboard/book', icon: ShoppingBag },
    { name: 'My Orders', href: '/dashboard/orders', icon: Clock },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link href="/">
              <Logo size="sm" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* User Profile Info */}
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-bold border border-primary/10 shadow-inner">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
              </div>
              <div className="text-left">
                <p className="text-sm font-extrabold text-slate-900 leading-none">{user?.name || 'Customer'}</p>
                <p className="text-xs font-semibold text-slate-500 mt-1 leading-none">{user?.phone || '+91 9999999999'}</p>
              </div>
            </div>

            {/* Logout button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hover:bg-red-50 hover:text-red-600 rounded-xl transition-all p-2 text-slate-500"
              title="Sign Out"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200/80 transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ height: 'calc(100vh - 73px)' }}
        >
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              const isPlaceOrder = item.href === '/dashboard/book'
              const cartItemCount = isPlaceOrder ? cartItems.reduce((acc, i) => acc + i.quantity, 0) : 0

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all text-sm font-bold tracking-wide uppercase ${
                    isActive
                      ? 'bg-accent/15 text-accent shadow-sm border border-accent/10'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-accent' : 'text-slate-400 group-hover:text-slate-900'} />
                  <span>{item.name}</span>
                  {cartItemCount > 0 && (
                    <span className="ml-auto bg-accent text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse tracking-normal normal-case">
                      {cartItemCount} Drop{cartItemCount > 1 ? 's' : ''}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Backdrop for mobile menu */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden backdrop-blur-xs transition-opacity"
            style={{ top: '73px' }}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:min-h-0 bg-slate-50 overflow-y-auto p-4 sm:p-6 lg:p-8" style={{ maxHeight: 'calc(100vh - 73px)' }}>
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
