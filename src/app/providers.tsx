'use client'

import React, { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { useAuthStore } from '@/store/auth'
import 'react-toastify/dist/ReactToastify.css'

export function Providers({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

