import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  category: string
  quantity: number
  service: 'wash' | 'wash_iron' | 'dry_clean' | 'premium'
  price: number
}

interface CartState {
  items: CartItem[]
  total: number
  tax: number
  deliveryFee: number
  discount: number
  addItem: (item: CartItem) => void
  removeItem: (category: string) => void
  updateItem: (category: string, item: CartItem) => void
  clearCart: () => void
  setTotal: (total: number) => void
  setTax: (tax: number) => void
  setDeliveryFee: (fee: number) => void
  setDiscount: (discount: number) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      tax: 0,
      deliveryFee: 0,
      discount: 0,
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.category === item.category)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.category === item.category
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (category) =>
        set((state) => ({
          items: state.items.filter((i) => i.category !== category),
        })),
      updateItem: (category, item) =>
        set((state) => ({
          items: state.items.map((i) => (i.category === category ? item : i)),
        })),
      clearCart: () =>
        set({
          items: [],
          total: 0,
          tax: 0,
          deliveryFee: 0,
          discount: 0,
        }),
      setTotal: (total) => set({ total }),
      setTax: (tax) => set({ tax }),
      setDeliveryFee: (fee) => set({ deliveryFee: fee }),
      setDiscount: (discount) => set({ discount }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

