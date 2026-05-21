'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardBody } from '@/components/ui/Card'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth'
import { toast } from 'react-toastify'
import { Phone, Lock, ArrowLeft, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/Logo'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!phone.match(/^[6-9]\d{9}$/)) {
        throw new Error('Please enter a valid 10-digit phone number')
      }

      const response = await apiClient.post<any>('/api/auth/send-otp', { phone })
      if (response?.success) {
        setStep('otp')
        toast.success('OTP sent to your phone')
      }
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP')
      toast.error(error.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!otp.match(/^\d{6}$/)) {
        throw new Error('OTP must be 6 digits')
      }

      const response = await apiClient.post<any>('/api/auth/verify-otp', {
        phone,
        otp,
      })

      if (response?.success) {
        const { token, user } = response.data
        setToken(token)
        setUser(user)
        localStorage.setItem('authToken', token)
        toast.success('Welcome to MANODROP!')
        router.push('/dashboard')
      }
    } catch (error: any) {
      setError(error.message || 'Failed to verify OTP')
      toast.error(error.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium ambient glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#0c2340,transparent_50%)] opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_75%,#10b981,transparent_45%)] opacity-20" />

      <div className="w-full max-w-md relative z-10 space-y-8">
        {/* Back Link */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>

        {/* Brand Display Card */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center">
          <Logo size="xl" lightMode={true} />
        </div>

        {/* Input Details Card */}
        <Card variant="elevated" className="border border-slate-800 bg-slate-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden relative">
          <CardBody className="p-8">
            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white">Sign In / Register</h2>
                  <p className="text-slate-400 text-sm font-medium">Verify your phone to explore all you desire</p>
                </div>

                <div className="space-y-4">
                  <Input
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={error}
                    icon={<Phone size={20} className="text-slate-500" />}
                    maxLength={10}
                    className="bg-slate-950/60 border-slate-800 text-white focus:border-accent rounded-2xl p-4"
                  />
                </div>

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={loading}
                  disabled={!phone || phone.length !== 10}
                  className="bg-gradient-to-r from-accent to-emerald-500 hover:from-emerald-500 hover:to-accent text-slate-950 font-bold py-4 rounded-2xl shadow-xl transition-all"
                >
                  Send Verification Code
                </Button>

                <div className="flex justify-center items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-accent" />
                  Secure OTP verification
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white">Enter Security Code</h2>
                  <p className="text-slate-400 text-sm font-medium">We sent a 6-digit OTP code to +91 {phone}</p>
                </div>

                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    error={error}
                    icon={<Lock size={20} className="text-slate-500" />}
                    maxLength={6}
                    className="bg-slate-950/60 border-slate-800 text-white focus:border-accent rounded-2xl p-4"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    onClick={() => {
                      setStep('phone')
                      setOtp('')
                      setError('')
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    loading={loading}
                    disabled={!otp || otp.length !== 6}
                    className="bg-gradient-to-r from-accent to-emerald-500 hover:from-emerald-500 hover:to-accent text-slate-950 font-bold py-4 rounded-2xl shadow-xl transition-all"
                  >
                    Confirm Code
                  </Button>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-center">
                  <p className="text-[11px] font-semibold text-accent tracking-wide uppercase">
                    💡 DEMO: Enter any 6-digit code to verify!
                  </p>
                </div>
              </form>
            )}
          </CardBody>
        </Card>

        <p className="text-center text-slate-500 text-xs font-semibold">
          By signing in, you agree to our Terms & Conditions and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
