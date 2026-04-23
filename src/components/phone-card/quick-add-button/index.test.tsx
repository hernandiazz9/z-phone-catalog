import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import enMessages from '../../../../messages/en.json'
import { CartProvider, useCart } from '@/context/cart-context'
import type { Phone } from '@/services/phones.types'
import { QuickAddButton } from '.'

beforeEach(() => {
  if (typeof HTMLDialogElement !== 'undefined') {
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true
    }
    HTMLDialogElement.prototype.close = function () {
      this.open = false
    }
  }
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
  window.localStorage.clear()
})

const phone = { id: 'APL-IP15-128', brand: 'Apple', name: 'iPhone 15' }

const singleVariantDetail: Phone = {
  id: phone.id,
  brand: phone.brand,
  name: phone.name,
  description: '',
  basePrice: 999,
  rating: 4.5,
  specs: {
    screen: '6.1"',
    resolution: '2556 x 1179',
    processor: 'A16',
    mainCamera: '48MP',
    selfieCamera: '12MP',
    battery: '3349 mAh',
    os: 'iOS 17',
    screenRefreshRate: '60Hz',
  },
  colorOptions: [{ name: 'Black', hexCode: '#000', imageUrl: 'http://example.test/black.webp' }],
  storageOptions: [{ capacity: '128 GB', price: 999 }],
  similarProducts: [],
}

const multiVariantDetail: Phone = {
  ...singleVariantDetail,
  colorOptions: [
    { name: 'Black', hexCode: '#000', imageUrl: 'http://example.test/black.webp' },
    { name: 'White', hexCode: '#fff', imageUrl: 'http://example.test/white.webp' },
  ],
  storageOptions: [
    { capacity: '128 GB', price: 999 },
    { capacity: '256 GB', price: 1099 },
  ],
}

function CartItemsList() {
  const { items } = useCart()
  return (
    <ul data-testid="cart-items">
      {items.map((item) => (
        <li key={item.key}>
          {item.phoneId}|{item.storageCapacity}|{item.colorName}|{item.quantity}
        </li>
      ))}
    </ul>
  )
}

function renderButton() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <CartProvider>
        <QuickAddButton phone={phone} />
        <CartItemsList />
      </CartProvider>
    </NextIntlClientProvider>,
  )
}

describe('quick-add-button', () => {
  it('adds directly when the phone has a single color and a single storage', async () => {
    ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => singleVariantDetail,
    })
    const user = userEvent.setup()
    renderButton()

    await user.click(screen.getByRole('button', { name: /quick add iphone 15/i }))

    await waitFor(() =>
      expect(screen.getByTestId('cart-items')).toHaveTextContent('APL-IP15-128|128 GB|Black|1'),
    )
  })

  it('opens the variant picker modal when the phone has multiple options', async () => {
    ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => multiVariantDetail,
    })
    const user = userEvent.setup()
    renderButton()

    await user.click(screen.getByRole('button', { name: /quick add iphone 15/i }))

    await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument())
    expect(screen.getByTestId('cart-items').children).toHaveLength(0)
  })

  it('confirms the modal choice and adds the picked variant to the cart', async () => {
    ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => multiVariantDetail,
    })
    const user = userEvent.setup()
    renderButton()

    await user.click(screen.getByRole('button', { name: /quick add iphone 15/i }))
    await waitFor(() => screen.getByRole('heading', { level: 2 }))

    await user.click(screen.getByRole('radio', { name: '256 GB' }))
    await user.click(screen.getByRole('radio', { name: 'White' }))
    await user.click(screen.getByRole('button', { name: /^add to cart$/i }))

    await waitFor(() =>
      expect(screen.getByTestId('cart-items')).toHaveTextContent('APL-IP15-128|256 GB|White|1'),
    )
  })

  it('prevents the default click behaviour so the wrapping Link does not navigate', () => {
    ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => singleVariantDetail,
    })
    renderButton()

    const button = screen.getByRole('button', { name: /quick add iphone 15/i })
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    button.dispatchEvent(clickEvent)
    expect(clickEvent.defaultPrevented).toBe(true)
  })

  it('does not add anything when the phone has no color or storage options', async () => {
    ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ ...singleVariantDetail, colorOptions: [], storageOptions: [] }),
    })
    const user = userEvent.setup()
    renderButton()

    await user.click(screen.getByRole('button', { name: /quick add iphone 15/i }))

    await waitFor(() =>
      expect(fetch as unknown as ReturnType<typeof vi.fn>).toHaveBeenCalledTimes(1),
    )
    expect(screen.getByTestId('cart-items').children).toHaveLength(0)
  })
})
