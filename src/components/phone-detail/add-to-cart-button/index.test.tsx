import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import enMessages from '../../../../messages/en.json'
import { AddToCartButton } from '.'

const addItemMock = vi.fn()

vi.mock('@/context/cart-context', () => ({
  useCart: () => ({
    items: [],
    totalCount: 0,
    totalPrice: 0,
    isHydrated: true,
    addItem: addItemMock,
    removeItem: vi.fn(),
    clearCart: vi.fn(),
  }),
}))

type Color = { name: string; hexCode: string; imageUrl: string }
type Storage = { capacity: string; price: number }

const phone = { id: 'APL-IP15-128', brand: 'Apple', name: 'iPhone 15' }
const color: Color = { name: 'Black', hexCode: '#000000', imageUrl: 'http://example.test/k.webp' }
const storage: Storage = { capacity: '128 GB', price: 999 }

function renderButton(pickedColor: Color | null, pickedStorage: Storage | null) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <AddToCartButton phone={phone} color={pickedColor} storage={pickedStorage} />
    </NextIntlClientProvider>,
  )
}

describe('add-to-cart-button', () => {
  beforeEach(() => {
    addItemMock.mockClear()
  })

  it('is disabled until both color and storage are picked', () => {
    const { rerender } = renderButton(null, null)
    expect(screen.getByRole('button')).toBeDisabled()

    rerender(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <AddToCartButton phone={phone} color={color} storage={null} />
      </NextIntlClientProvider>,
    )
    expect(screen.getByRole('button')).toBeDisabled()

    rerender(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <AddToCartButton phone={phone} color={null} storage={storage} />
      </NextIntlClientProvider>,
    )
    expect(screen.getByRole('button')).toBeDisabled()

    rerender(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <AddToCartButton phone={phone} color={color} storage={storage} />
      </NextIntlClientProvider>,
    )
    expect(screen.getByRole('button')).toBeEnabled()
  })

  it('calls addItem with phone, color and storage on click', async () => {
    const user = userEvent.setup()
    renderButton(color, storage)
    await user.click(screen.getByRole('button'))
    expect(addItemMock).toHaveBeenCalledWith({ phone, color, storage })
  })

  it('swaps the label to the confirmation message after a successful click', async () => {
    const user = userEvent.setup()
    renderButton(color, storage)
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent(/^add$/i)
    await user.click(button)
    expect(button).toHaveTextContent(/added/i)
  })
})
