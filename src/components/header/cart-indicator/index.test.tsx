import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import enMessages from '../../../../messages/en.json'
import { CartProvider, useCart } from '@/context/cart-context'
import type { AddToCartInput } from '@/context/cart.types'
import { CartIndicator } from '.'

const STORAGE_KEY = 'z-phone-catalog:cart:v1'

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string
    children: React.ReactNode
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

const samplePhone: AddToCartInput['phone'] = {
  id: 'SMG-S24U',
  brand: 'Samsung',
  name: 'Galaxy S24 Ultra',
}
const sampleStorage: AddToCartInput['storage'] = { capacity: '256 GB', price: 1229 }
const sampleColor: AddToCartInput['color'] = {
  name: 'Black',
  hexCode: '#000',
  imageUrl: 'http://example.test/black.webp',
}

function CartAdder() {
  const { addItem } = useCart()
  return (
    <button
      type="button"
      onClick={() => addItem({ phone: samplePhone, storage: sampleStorage, color: sampleColor })}
    >
      add
    </button>
  )
}

function renderIndicator() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <CartProvider>
        <CartIndicator />
        <CartAdder />
      </CartProvider>
    </NextIntlClientProvider>,
  )
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  window.localStorage.clear()
})

describe('cart-indicator', () => {
  it('exposes "Cart, empty" as the aria-label when there are no items', async () => {
    renderIndicator()
    await waitFor(() =>
      expect(screen.getByRole('link')).toHaveAttribute('aria-label', 'Cart, empty'),
    )
  })

  it('reflects the total count from the cart context once hydrated', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          key: 'k1',
          phoneId: 'SMG-S24U',
          brand: 'Samsung',
          name: 'Galaxy S24 Ultra',
          imageUrl: 'http://example.test/black.webp',
          storageCapacity: '256 GB',
          colorName: 'Black',
          colorHex: '#000',
          unitPrice: 1229,
          quantity: 3,
        },
      ]),
    )
    renderIndicator()
    await waitFor(() =>
      expect(screen.getByRole('link')).toHaveAttribute('aria-label', 'Cart, 3 items'),
    )
  })

  it('does not pulse the icon on the initial hydrated render', async () => {
    renderIndicator()
    await waitFor(() => screen.getByRole('link'))
    const svg = screen.getByRole('link').querySelector('svg')
    expect(svg).not.toHaveClass('animate-cart-icon-flash')
  })

  it('pulses the icon when the cart count grows after hydration', async () => {
    const user = userEvent.setup()
    renderIndicator()
    await waitFor(() =>
      expect(screen.getByRole('link')).toHaveAttribute('aria-label', 'Cart, empty'),
    )

    await user.click(screen.getByRole('button', { name: 'add' }))

    await waitFor(() => {
      const svg = screen.getByRole('link').querySelector('svg')
      expect(svg).toHaveClass('animate-cart-icon-flash')
    })
  })
})
