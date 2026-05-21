import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios'

const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000')
const API_RETRY_ATTEMPTS = parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3')

class APIClient {
  private client: AxiosInstance
  private retryCount: Record<string, number> = {}

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      const token = this.getAuthToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config as AxiosRequestConfig & { __retryCount?: number }

        if (!config || !config.url) {
          return Promise.reject(error)
        }

        config.__retryCount = config.__retryCount || 0

        if (
          error.response?.status === 429 &&
          config.__retryCount < API_RETRY_ATTEMPTS
        ) {
          config.__retryCount++
          const delay = Math.pow(2, config.__retryCount) * 1000
          await new Promise((resolve) => setTimeout(resolve, delay))
          return this.client(config)
        }

        if (error.response?.status === 401) {
          this.clearAuthToken()
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login'
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  }

  private clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.get<T>(url, config)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.post<T>(url, data, config)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.put<T>(url, data, config)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.patch<T>(url, data, config)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.delete<T>(url, config)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleError(error: any): never {
    if (error.response) {
      throw new Error(error.response.data?.message || error.message)
    } else if (error.request) {
      throw new Error('Network error. Please try again.')
    } else {
      throw error
    }
  }
}

export const apiClient = new APIClient()
