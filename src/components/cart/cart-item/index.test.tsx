import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import enMessages from '../../../../messages/en.json'
import type { CartItem as CartItemModel } from '@/context/cart.types'
import { CartItem } from '.'

vi.mock('next/image', () => ({
  default: ({
    priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} loading={priority ? 'eager' : 'lazy'} />
  ),
}))

const sampleItem: CartItemModel = {
  key: 'APL-IP15-128__128 GB__Black',
  phoneId: 'APL-IP15-128',
  brand: 'Apple',
  name: 'iPhone 15',
  imageUrl: 'http://example.test/iphone.webp',
  storageCapacity: '128 GB',
  colorName: 'Black',
  colorHex: '#000000',
  unitPrice: 999,
  quantity: 2,
}

function renderItem(item: CartItemModel = sampleItem) {
  const onRemove = vi.fn()
  const onIncrement = vi.fn()
  const onDecrement = vi.fn()
  const utils = render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <CartItem
        item={item}
        onRemove={onRemove}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />
    </NextIntlClientProvider>,
  )
  return { ...utils, onRemove, onIncrement, onDecrement }
}

describe('cart-item', () => {
  it('renders the name and specs', () => {
    renderItem()
    expect(screen.getByText('iPhone 15')).toBeInTheDocument()
    expect(screen.getByText('128 GB | Black')).toBeInTheDocument()
  })

  it('shows the line subtotal (unit price × quantity)', () => {
    renderItem()
    expect(screen.getByText('1998 EUR')).toBeInTheDocument()
  })

  it('uses brand + name as the image alt text', () => {
    renderItem()
    expect(screen.getByAltText('Apple iPhone 15')).toBeInTheDocument()
  })

  it('calls onRemove when the remove button is clicked', async () => {
    const user = userEvent.setup()
    const { onRemove } = renderItem()
    await user.click(screen.getByRole('button', { name: /remove iphone 15 from cart/i }))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('calls onIncrement and onDecrement from the stepper', async () => {
    const user = userEvent.setup()
    const { onIncrement, onDecrement } = renderItem()
    await user.click(screen.getByRole('button', { name: /add one more iphone 15/i }))
    await user.click(screen.getByRole('button', { name: /remove one iphone 15/i }))
    expect(onIncrement).toHaveBeenCalledTimes(1)
    expect(onDecrement).toHaveBeenCalledTimes(1)
  })
})
