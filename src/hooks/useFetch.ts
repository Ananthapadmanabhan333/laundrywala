'use client'

import { useEffect, useState, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

interface UseFetchOptions {
  skip?: boolean
  refetchOnMount?: boolean
  cache?: boolean
}

interface UseFetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useFetch<T>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const { skip = false, refetchOnMount = true } = options

  const fetch = useCallback(async () => {
    if (skip) return

    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await apiClient.get<T>(url)
      setState({
        data,
        loading: false,
        error: null,
      })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      })
    }
  }, [url, skip])

  useEffect(() => {
    if (refetchOnMount) {
      fetch()
    }
  }, [fetch, refetchOnMount])

  return {
    ...state,
    refetch: fetch,
  }
}
