'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/Logo'
import { User, LogOut, ChevronDown, LayoutDashboard, ShieldAlert, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading, logout } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown when route changes
  useEffect(() => {
    setDropdownOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  // Helper to get initials
  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="container-custom flex items-center justify-between py-4">
        <Link href="/" className="flex items-center">
          <Logo size="md" />
        </Link>

        {/* Navigation Links - Hidden on specific detail/auth views if needed, otherwise normal */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link href="/#services" className="hover:text-primary transition-colors">Garment Care</Link>
          <Link href="/#metrics" className="hover:text-primary transition-colors">Why Us</Link>
          <Link href="/#pricing" className="hover:text-primary transition-colors">Price List</Link>
          <Link href="/#testimonials" className="hover:text-primary transition-colors">Reviews</Link>
        </div>

        {/* Dynamic Authentication Section */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 font-medium bg-slate-50 rounded-xl border border-slate-100">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Checking...</span>
            </div>
          ) : isAuthenticated && user ? (
            <div className="relative flex items-center gap-2" ref={dropdownRef}>
              {/* My Account Main CTA */}
              <Link href="/dashboard">
                <Button size="sm" className="bg-primary hover:bg-primary/95 text-white font-bold shadow-md px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5">
                  My Account
                </Button>
              </Link>

              {/* Avatar trigger for account settings & logout */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 p-1 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-colors focus:outline-none"
                aria-label="User menu"
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white text-xs font-black shadow-inner">
                  {getInitials(user.name)}
                </div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Account Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Profile Summary */}
                  <div className="pb-3 border-b border-slate-100">
                    <p className="text-sm font-black text-slate-800 truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 font-medium truncate">{user.phone}</p>
                    <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                      {user.accountType}
                    </div>
                  </div>

                  {/* Dropdown Links */}
                  <div className="space-y-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <LayoutDashboard size={16} className="text-slate-400" />
                      Dashboard
                    </Link>
                    {user.accountType === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <ShieldAlert size={16} className="text-rose-400" />
                        Admin Console
                      </Link>
                    )}
                  </div>

                  {/* Logout Button */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                    >
                      <LogOut size={16} className="text-red-400" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-bold text-slate-700 hover:text-primary transition-colors px-4 py-2">
                User Login
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
  )
}
