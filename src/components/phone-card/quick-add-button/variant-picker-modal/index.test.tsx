import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import enMessages from '../../../../../messages/en.json'
import type { ColorOption, Phone, StorageOption } from '@/services/phones.types'
import { VariantPickerModal } from '.'

beforeEach(() => {
  if (typeof HTMLDialogElement !== 'undefined') {
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true
    }
    HTMLDialogElement.prototype.close = function () {
      this.open = false
    }
  }
})

const phone: Phone = {
  id: 'APL-IP15',
  brand: 'Apple',
  name: 'iPhone 15',
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
  colorOptions: [
    { name: 'Black', hexCode: '#000', imageUrl: 'http://example.test/black.webp' },
    { name: 'White', hexCode: '#fff', imageUrl: 'http://example.test/white.webp' },
  ],
  storageOptions: [
    { capacity: '128 GB', price: 999 },
    { capacity: '256 GB', price: 1099 },
  ],
  similarProducts: [],
}

function renderModal(
  overrides: {
    open?: boolean
    onClose?: () => void
    onConfirm?: (payload: { color: ColorOption; storage: StorageOption }) => void
  } = {},
) {
  const onClose = vi.fn(overrides.onClose)
  const onConfirm = vi.fn(overrides.onConfirm)
  const open = overrides.open ?? true
  const utils = render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <VariantPickerModal phone={phone} open={open} onClose={onClose} onConfirm={onConfirm} />
    </NextIntlClientProvider>,
  )
  return { ...utils, onClose, onConfirm }
}

describe('variant-picker-modal', () => {
  it('shows the "from base price" label until a storage is selected', () => {
    renderModal()
    expect(screen.getByText('From 999 EUR')).toBeInTheDocument()
  })

  it('updates the displayed price when a storage option is chosen', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByRole('radio', { name: '256 GB' }))
    expect(screen.getByText('1099 EUR')).toBeInTheDocument()
  })

  it('keeps the confirm button disabled until both color and storage are picked', async () => {
    const user = userEvent.setup()
    renderModal()
    const confirm = screen.getByRole('button', { name: /add to cart/i })
    expect(confirm).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: '128 GB' }))
    expect(confirm).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'White' }))
    expect(confirm).toBeEnabled()
  })

  it('emits the chosen color and storage on confirm', async () => {
    const user = userEvent.setup()
    const { onConfirm } = renderModal()

    await user.click(screen.getByRole('radio', { name: '256 GB' }))
    await user.click(screen.getByRole('radio', { name: 'White' }))
    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onConfirm).toHaveBeenCalledWith({
      color: phone.colorOptions[1],
      storage: phone.storageOptions[1],
    })
  })

  it('calls onClose from the cancel button', async () => {
    const user = userEvent.setup()
    const { onClose } = renderModal()
    await user.click(screen.getByRole('button', { name: /^cancel$/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose from the close (X) button', async () => {
    const user = userEvent.setup()
    const { onClose } = renderModal()
    await user.click(screen.getByRole('button', { name: /close options/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('resets the picked color and storage each time the modal reopens', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onConfirm = vi.fn()
    const { rerender } = render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <VariantPickerModal phone={phone} open={true} onClose={onClose} onConfirm={onConfirm} />
      </NextIntlClientProvider>,
    )

    await user.click(screen.getByRole('radio', { name: '256 GB' }))
    await user.click(screen.getByRole('radio', { name: 'White' }))
    expect(screen.getByText('1099 EUR')).toBeInTheDocument()

    rerender(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <VariantPickerModal phone={phone} open={false} onClose={onClose} onConfirm={onConfirm} />
      </NextIntlClientProvider>,
    )
    rerender(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <VariantPickerModal phone={phone} open={true} onClose={onClose} onConfirm={onConfirm} />
      </NextIntlClientProvider>,
    )

    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled()
    expect(screen.getByText('From 999 EUR')).toBeInTheDocument()
  })
})
