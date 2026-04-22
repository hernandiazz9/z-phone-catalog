'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { AddToCartInput, CartContextValue, CartItem } from './cart.types'

const STORAGE_KEY = 'z-phone-catalog:cart:v1'

const CartContext = createContext<CartContextValue | null>(null)

function buildKey(phoneId: string, storageCapacity: string, colorName: string): string {
  return `${phoneId}__${storageCapacity}__${colorName}`
}

function readFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  // `isHydrated` gates the effect that writes to localStorage so the very
  // first client render (which starts with an empty cart) cannot overwrite
  // a previously persisted cart.
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Hydrating from localStorage *after* mount is intentional: reading it
    // during render would cause an SSR / client hydration mismatch whenever
    // the persisted cart differs from the server-rendered empty state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readFromStorage())
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Storage can be disabled (private mode, full quota). Fail silently.
    }
  }, [items, isHydrated])

  const addItem = useCallback(({ phone, storage, color }: AddToCartInput) => {
    const key = buildKey(phone.id, storage.capacity, color.name)
    setItems((current) => {
      const existing = current.find((item) => item.key === key)
      if (existing) {
        return current.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      const next: CartItem = {
        key,
        phoneId: phone.id,
        brand: phone.brand,
        name: phone.name,
        imageUrl: color.imageUrl,
        storageCapacity: storage.capacity,
        colorName: color.name,
        colorHex: color.hexCode,
        unitPrice: storage.price,
        quantity: 1,
      }
      return [...current, next]
    })
  }, [])

  const removeItem = useCallback((key: string) => {
    setItems((current) => current.filter((item) => item.key !== key))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    return { items, totalCount, totalPrice, isHydrated, addItem, removeItem, clearCart }
  }, [items, isHydrated, addItem, removeItem, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const value = useContext(CartContext)
  if (!value) {
    throw new Error('useCart must be used within a <CartProvider>.')
  }
  return value
}
