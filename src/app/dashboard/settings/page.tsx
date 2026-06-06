'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useAuthStore } from '@/store/auth'
import { apiClient } from '@/lib/api-client'
import { Bell, Lock, MapPin, Phone, User, Shield, Check, Trash2, Key, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

interface AddressItem {
  _id: string
  title: string
  addressLine: string
  latitude: number
  longitude: number
  isDefault: boolean
}

export default function SettingsPage() {
  const { user, logout, setUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  })

  // Sync state if store updates
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      })
    }
  }, [user])

  const [addresses, setAddresses] = useState<AddressItem[]>([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addressFormData, setAddressFormData] = useState({
    title: '',
    addressLine: '',
    latitude: 8.5241,
    longitude: 76.9366,
    isDefault: false,
  })

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true)
      const response = await apiClient.get<any>('/api/addresses')
      if (response?.success && response.data) {
        setAddresses(response.data)
      }
    } catch (error) {
      console.error('Failed to load addresses:', error)
    } finally {
      setLoadingAddresses(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'address') {
      fetchAddresses()
    }
  }, [activeTab])

  const [notificationPreferences, setNotificationPreferences] = useState([
    { id: 'updates', title: 'Order Telemetry Updates', description: 'Get live tracker updates on your smart drops', checked: true },
    { id: 'push', title: 'Smart Push Notifications', description: 'Receive direct dispatch updates on your active devices', checked: true },
    { id: 'sms', title: 'SMS Transaction Alerts', description: 'Get secure beacon verification codes via SMS text', checked: false },
    { id: 'promo', title: 'Exclusive Drops & Curated Offers', description: 'Receive private discount alerts for brand collections', checked: true },
  ])

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & 2FA', icon: Lock },
    { id: 'address', label: 'Saved Locations', icon: MapPin },
  ]

  const handleProfileSave = async () => {
    try {
      const res = await apiClient.put<any>('/api/auth/me', {
        name: formData.name,
        email: formData.email,
        address: formData.address,
      })
      if (res?.success && res.data) {
        setUser(res.data)
        toast.success('Profile details saved successfully!')
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to update profile')
    }
  }

  const handlePreferenceToggle = (id: string) => {
    setNotificationPreferences((prev) =>
      prev.map((pref) => (pref.id === id ? { ...pref, checked: !pref.checked } : pref))
    )
    toast.info('Notification setting updated.')
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Your security password has been updated.')
  }

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await apiClient.post<any>('/api/addresses', addressFormData)
      if (res?.success) {
        toast.success('Address saved successfully!')
        setIsModalOpen(false)
        setAddressFormData({
          title: '',
          addressLine: '',
          latitude: 8.5241,
          longitude: 76.9366,
          isDefault: false,
        })
        fetchAddresses()
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save address')
    }
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    try {
      const res = await apiClient.delete<any>(`/api/addresses/${id}`)
      if (res?.success) {
        toast.success('Address deleted successfully!')
        fetchAddresses()
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete address')
    }
  }


  return (
    <div className="space-y-8 text-left animate-fade-in">
      {/* Title Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Shield className="text-primary w-8 h-8" />
          <span>Settings & Preferences</span>
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          Manage your secure profile telemetry, automated scheduling preferences, and saved safe-drop delivery addresses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-4">
          <Card variant="default" className="border border-slate-200/60 shadow-sm rounded-3xl p-4 bg-white">
            <CardBody className="p-0">
              <nav className="space-y-1.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all text-sm font-extrabold tracking-wide uppercase border ${
                        isActive
                          ? 'bg-primary text-white border-primary shadow-md'
                          : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-accent' : 'text-slate-400'} />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </CardBody>
          </Card>
        </div>

        {/* Main Panels Content */}
        <div className="lg:col-span-8">
          {/* PROFILE VIEW */}
          {activeTab === 'profile' && (
            <Card variant="elevated" className="border border-slate-100 shadow-lg rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Profile Information</h2>
              </CardHeader>
              <CardBody className="p-6 space-y-6">
                {/* Floating Avatar Banner */}
                <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-tr from-primary to-accent rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg border-4 border-white ring-2 ring-primary/10">
                      {formData.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-accent border-2 border-white rounded-full flex items-center justify-center shadow">
                      <Check size={10} className="text-slate-950 font-black" />
                    </span>
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <p className="font-black text-xl text-slate-900 tracking-tight">{formData.name}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded inline-block">
                      Enterprise Tier
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    icon={<User size={18} />}
                    className="border-slate-200 focus:ring-accent rounded-xl text-sm font-bold text-slate-900"
                  />
                  <Input
                    label="Phone Number"
                    value={formData.phone}
                    disabled
                    icon={<Phone size={18} />}
                    className="border-slate-200 bg-slate-50 text-slate-500 rounded-xl text-sm font-bold"
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-slate-200 focus:ring-accent rounded-xl text-sm font-bold text-slate-900"
                />

                <Input
                  label="Saved Dispatch Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  icon={<MapPin size={18} />}
                  className="border-slate-200 focus:ring-accent rounded-xl text-sm font-bold text-slate-900"
                />
              </CardBody>
              <CardFooter className="bg-slate-50/50 p-6 border-t border-slate-100">
                <Button
                  onClick={handleProfileSave}
                  fullWidth
                  className="bg-gradient-to-r from-accent to-emerald-500 hover:from-emerald-500 hover:to-accent text-slate-950 font-bold py-3.5 rounded-xl shadow-md transition-all"
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* NOTIFICATIONS VIEW */}
          {activeTab === 'notifications' && (
            <Card variant="elevated" className="border border-slate-100 shadow-lg rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Notification Preferences</h2>
              </CardHeader>
              <CardBody className="p-6 space-y-4">
                {notificationPreferences.map((pref) => (
                  <div
                    key={pref.id}
                    onClick={() => handlePreferenceToggle(pref.id)}
                    className={`flex items-start justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                      pref.checked
                        ? 'border-accent/30 bg-emerald-50/10'
                        : 'border-slate-200/60 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="space-y-1 pr-4">
                      <p className="text-sm font-bold text-slate-900">{pref.title}</p>
                      <p className="text-[11px] font-semibold text-slate-400 leading-normal">{pref.description}</p>
                    </div>
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-300 ${
                          pref.checked ? 'bg-accent' : 'bg-slate-200'
                        }`}
                      >
                        <div
                          className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                            pref.checked ? 'translate-x-4.5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}

          {/* SECURITY VIEW */}
          {activeTab === 'security' && (
            <Card variant="elevated" className="border border-slate-100 shadow-lg rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Security Credentials & 2FA</h2>
              </CardHeader>
              <CardBody className="p-6 space-y-6">
                {/* Update Password Panel */}
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Key size={14} className="text-primary" />
                    <span>Change Secure Password</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                    />
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                    />
                    <Input
                      label="Confirm Password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                    />
                  </div>
                  <Button type="submit" size="sm" className="rounded-xl font-bold py-2 px-5">
                    Update Security Password
                  </Button>
                </form>

                {/* Two-Factor Authentication box */}
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50 space-y-3.5">
                  <div>
                    <p className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      🛡️ Secure Two-Factor Authentication (2FA)
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500 mt-1 leading-normal">
                      Strengthen account logistics by verifying every transaction with an autonomous wireless smart key.
                    </p>
                  </div>
                  <Button variant="secondary" className="rounded-xl border border-emerald-200 bg-white font-bold py-2 text-xs">
                    Enable Autonomous 2FA
                  </Button>
                </div>

                {/* Danger zone */}
                <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-3">
                  <div>
                    <p className="font-extrabold text-red-900 text-sm">Danger Zone Operations</p>
                    <p className="text-[11px] font-semibold text-slate-500 mt-1 leading-normal">
                      Permanently terminate your MANODROP logistics vault and delete all active smart beacon codes.
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    className="rounded-xl font-bold py-2.5 text-xs px-5"
                    onClick={() => {
                      if (confirm('Are you absolutely sure you want to terminate your MANODROP vault? This is irreversible.')) {
                        logout()
                      }
                    }}
                  >
                    Decommission Account Vault
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* ADDRESS VIEW */}
          {activeTab === 'address' && (
            <Card variant="elevated" className="border border-slate-100 shadow-lg rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Saved Locations</h2>
                <Button size="sm" className="rounded-xl text-xs py-2" onClick={() => setIsModalOpen(true)}>
                  Add New Drop
                </Button>
              </CardHeader>
              <CardBody className="p-6 space-y-4">
                {loadingAddresses ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-primary h-8 w-8" />
                  </div>
                ) : addresses.length === 0 ? (
                  <p className="text-center text-slate-400 py-8 font-semibold">No saved addresses found.</p>
                ) : (
                  addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className={`p-4 border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                        addr.isDefault
                          ? 'border-accent bg-emerald-50/5 ring-1 ring-accent'
                          : 'border-slate-200/60 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-slate-900 text-sm">{addr.title}</p>
                          {addr.isDefault && (
                            <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 bg-accent text-slate-950 rounded-full shadow-inner">
                              Default Drop
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold text-slate-400 leading-relaxed">{addr.addressLine}</p>
                      </div>
                      <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl font-bold text-red-500 hover:text-red-600 hover:bg-red-50 py-1.5 px-2"
                          onClick={() => handleDeleteAddress(addr._id)}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          )}

          {/* Add Address Modal */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Saved Location">
            <form onSubmit={handleSaveAddress} className="space-y-4 text-left">
              <Input
                label="Location Tag"
                placeholder="E.g., Home, Work, Apartment"
                required
                value={addressFormData.title}
                onChange={(e) => setAddressFormData({ ...addressFormData, title: e.target.value })}
                className="border-slate-200 focus:ring-accent rounded-xl text-sm font-bold text-slate-900"
              />
              <Input
                label="Full Address Line"
                placeholder="E.g., 123 Luxury Tower, Apt 12B, Road 4, Bangalore"
                required
                value={addressFormData.addressLine}
                onChange={(e) => setAddressFormData({ ...addressFormData, addressLine: e.target.value })}
                className="border-slate-200 focus:ring-accent rounded-xl text-sm font-bold text-slate-900"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Latitude"
                  type="number"
                  step="0.0001"
                  required
                  value={addressFormData.latitude}
                  onChange={(e) => setAddressFormData({ ...addressFormData, latitude: parseFloat(e.target.value) || 0 })}
                  className="border-slate-200 focus:ring-accent rounded-xl text-sm font-bold text-slate-900"
                />
                <Input
                  label="Longitude"
                  type="number"
                  step="0.0001"
                  required
                  value={addressFormData.longitude}
                  onChange={(e) => setAddressFormData({ ...addressFormData, longitude: parseFloat(e.target.value) || 0 })}
                  className="border-slate-200 focus:ring-accent rounded-xl text-sm font-bold text-slate-900"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="defaultAddressCheckbox"
                  checked={addressFormData.isDefault}
                  onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                  className="rounded text-accent focus:ring-accent"
                />
                <label htmlFor="defaultAddressCheckbox" className="text-xs font-bold text-slate-600 uppercase select-none">
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
      </div>
    </div>
  )
}
