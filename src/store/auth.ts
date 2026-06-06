import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
  id: string
  phone: string
  name: string
  email?: string
  profileImage?: string
  address: string
  latitude: number
  longitude: number
  accountType: 'customer' | 'agent' | 'admin'
  isVerified: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  initialize: () => Promise<void>
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
      setToken: (token) =>
        set({
          token,
        }),
      setLoading: (loading) =>
        set({
          isLoading: loading,
        }),
      logout: async () => {
        set({ isLoading: true });
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch (e) {
          console.error('Logout request failed', e);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
      clear: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      initialize: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/auth/me');
          if (res.ok) {
            const json = await res.json();
            // support both successResponse wrapped user and plain structures
            const userData = json.data?.user || json.data;
            if (userData && (userData.id || userData._id)) {
              set({
                user: {
                  id: userData.id || userData._id,
                  phone: userData.phone,
                  name: userData.name,
                  email: userData.email,
                  profileImage: userData.profileImage,
                  address: userData.address,
                  latitude: userData.latitude,
                  longitude: userData.longitude,
                  accountType: userData.accountType,
                  isVerified: userData.isVerified,
                },
                isAuthenticated: true,
              });
            } else {
              set({ user: null, isAuthenticated: false });
            }
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (e) {
          console.error('Auth init error', e);
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

