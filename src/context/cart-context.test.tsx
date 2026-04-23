import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { CartProvider, useCart } from './cart-context'
import type { AddToCartInput } from './cart.types'

const STORAGE_KEY = 'z-phone-catalog:cart:v1'

const samplePhone: AddToCartInput['phone'] = {
  id: 'SMG-S24U',
  brand: 'Samsung',
  name: 'Galaxy S24 Ultra',
}

const sampleStorage256: AddToCartInput['storage'] = {
  capacity: '256 GB',
  price: 1229,
}

const sampleStorage512: AddToCartInput['storage'] = {
  capacity: '512 GB',
  price: 1329,
}

const sampleColorBlack: AddToCartInput['color'] = {
  name: 'Titanium Black',
  hexCode: '#000000',
  imageUrl: 'http://example.test/black.webp',
}

const sampleColorViolet: AddToCartInput['color'] = {
  name: 'Titanium Violet',
  hexCode: '#8E6F96',
  imageUrl: 'http://example.test/violet.webp',
}

function wrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}

async function setupHook() {
  const hook = renderHook(() => useCart(), { wrapper })
  await waitFor(() => expect(hook.result.current.isHydrated).toBe(true))
  return hook
}

describe('cart-context', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it('starts empty and reports isHydrated after mount', async () => {
    const { result } = await setupHook()
    expect(result.current.items).toEqual([])
    expect(result.current.totalCount).toBe(0)
    expect(result.current.totalPrice).toBe(0)
  })

  it('addItem adds a new cart entry with quantity 1', async () => {
    const { result } = await setupHook()

    act(() => {
      result.current.addItem({
        phone: samplePhone,
        storage: sampleStorage256,
        color: sampleColorBlack,
      })
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0]).toMatchObject({
      phoneId: 'SMG-S24U',
      storageCapacity: '256 GB',
      colorName: 'Titanium Black',
      unitPrice: 1229,
      quantity: 1,
    })
    expect(result.current.totalCount).toBe(1)
    expect(result.current.totalPrice).toBe(1229)
  })

  it('addItem increments quantity when the same variant is added again', async () => {
    const { result } = await setupHook()
    const input = { phone: samplePhone, storage: sampleStorage256, color: sampleColorBlack }

    act(() => result.current.addItem(input))
    act(() => result.current.addItem(input))

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
    expect(result.current.totalCount).toBe(2)
    expect(result.current.totalPrice).toBe(2458)
  })

  it('addItem creates separate entries for different storage or color', async () => {
    const { result } = await setupHook()

    act(() =>
      result.current.addItem({
        phone: samplePhone,
        storage: sampleStorage256,
        color: sampleColorBlack,
      }),
    )
    act(() =>
      result.current.addItem({
        phone: samplePhone,
        storage: sampleStorage512,
        color: sampleColorBlack,
      }),
    )
    act(() =>
      result.current.addItem({
        phone: samplePhone,
        storage: sampleStorage256,
        color: sampleColorViolet,
      }),
    )

    expect(result.current.items).toHaveLength(3)
    expect(result.current.totalCount).toBe(3)
    expect(result.current.totalPrice).toBe(1229 + 1329 + 1229)
  })

  it('removeItem drops the entry by key', async () => {
    const { result } = await setupHook()

    act(() =>
      result.current.addItem({
        phone: samplePhone,
        storage: sampleStorage256,
        color: sampleColorBlack,
      }),
    )
    const key = result.current.items[0].key
    act(() => result.current.removeItem(key))

    expect(result.current.items).toHaveLength(0)
    expect(result.current.totalCount).toBe(0)
  })

  it('incrementItem bumps the quantity of the matching entry', async () => {
    const { result } = await setupHook()
    act(() =>
      result.current.addItem({
        phone: samplePhone,
        storage: sampleStorage256,
        color: sampleColorBlack,
      }),
    )
    const key = result.current.items[0].key

    act(() => result.current.incrementItem(key))
    act(() => result.current.incrementItem(key))

    expect(result.current.items[0].quantity).toBe(3)
    expect(result.current.totalCount).toBe(3)
    expect(result.current.totalPrice).toBe(1229 * 3)
  })

  it('decrementItem reduces quantity and removes the entry when it would reach zero', async () => {
    const { result } = await setupHook()
    const input = { phone: samplePhone, storage: sampleStorage256, color: sampleColorBlack }
    act(() => result.current.addItem(input))
    act(() => result.current.addItem(input))
    const key = result.current.items[0].key

    act(() => result.current.decrementItem(key))
    expect(result.current.items[0].quantity).toBe(1)
    expect(result.current.totalCount).toBe(1)

    act(() => result.current.decrementItem(key))
    expect(result.current.items).toHaveLength(0)
    expect(result.current.totalCount).toBe(0)
  })

  it('clearCart empties the cart', async () => {
    const { result } = await setupHook()
    act(() =>
      result.current.addItem({
        phone: samplePhone,
        storage: sampleStorage256,
        color: sampleColorBlack,
      }),
    )

    act(() => result.current.clearCart())
    expect(result.current.items).toEqual([])
  })

  it('persists changes to localStorage', async () => {
    const { result } = await setupHook()
    act(() =>
      result.current.addItem({
        phone: samplePhone,
        storage: sampleStorage256,
        color: sampleColorBlack,
      }),
    )

    await waitFor(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      expect(stored).not.toBeNull()
      expect(JSON.parse(stored as string)).toHaveLength(1)
    })
  })

  it('hydrates from localStorage on mount', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          key: 'SMG-S24U__256 GB__Titanium Black',
          phoneId: 'SMG-S24U',
          brand: 'Samsung',
          name: 'Galaxy S24 Ultra',
          imageUrl: 'http://example.test/black.webp',
          storageCapacity: '256 GB',
          colorName: 'Titanium Black',
          colorHex: '#000000',
          unitPrice: 1229,
          quantity: 2,
        },
      ]),
    )

    const { result } = await setupHook()
    expect(result.current.items).toHaveLength(1)
    expect(result.current.totalCount).toBe(2)
    expect(result.current.totalPrice).toBe(2458)
  })

  it('throws when useCart is used outside of a provider', () => {
    expect(() => renderHook(() => useCart())).toThrow(/CartProvider/)
  })
})
