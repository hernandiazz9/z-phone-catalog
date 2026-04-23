import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import enMessages from '../../../../../messages/en.json'
import { QuantityStepper } from '.'

function renderStepper(quantity = 1) {
  const onIncrement = vi.fn()
  const onDecrement = vi.fn()
  render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <QuantityStepper
        itemName="iPhone 15"
        quantity={quantity}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />
    </NextIntlClientProvider>,
  )
  return { onIncrement, onDecrement }
}

describe('quantity-stepper', () => {
  it('renders the current quantity', () => {
    renderStepper(3)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('fires onIncrement when the + button is clicked', async () => {
    const user = userEvent.setup()
    const { onIncrement } = renderStepper(2)
    await user.click(screen.getByRole('button', { name: /add one more iphone 15/i }))
    expect(onIncrement).toHaveBeenCalledTimes(1)
  })

  it('fires onDecrement when the − button is clicked', async () => {
    const user = userEvent.setup()
    const { onDecrement } = renderStepper(2)
    await user.click(screen.getByRole('button', { name: /remove one iphone 15/i }))
    expect(onDecrement).toHaveBeenCalledTimes(1)
  })
})
