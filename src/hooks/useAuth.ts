'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { apiClient } from '@/lib/api-client'

export function useAuth() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await apiClient.get<any>('/api/auth/me')
        if (response?.data) {
          setUser(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [setUser, logout])

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
  }
}

export function useProtectedRoute() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
    } else if (!isLoading) {
      setIsAuthorized(true)
    }
  }, [isAuthenticated, isLoading])

  return {
    isAuthorized,
    isLoading,
    user,
  }
}
