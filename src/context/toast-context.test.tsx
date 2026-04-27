import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import enMessages from '../../messages/en.json'
import { animation } from '@/config/animation'
import { ToastProvider, useToast } from './toast-context'

function Trigger({ message = 'Hello' }: { message?: string }) {
  const { show } = useToast()
  return (
    <button type="button" onClick={() => show(message)}>
      fire
    </button>
  )
}

function renderWithProvider(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <ToastProvider>{ui}</ToastProvider>
    </NextIntlClientProvider>,
  )
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('toast-context', () => {
  it('shows a toast when show() is called', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderWithProvider(<Trigger message="Added to cart" />)

    await user.click(screen.getByRole('button', { name: 'fire' }))

    expect(screen.getByText('Added to cart')).toBeInTheDocument()
  })

  it('auto-dismisses the toast after the configured visible duration', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderWithProvider(<Trigger message="Bye soon" />)

    await user.click(screen.getByRole('button', { name: 'fire' }))
    expect(screen.getByText('Bye soon')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(animation.toastVisible + 50)
    })

    await waitFor(() => expect(screen.queryByText('Bye soon')).not.toBeInTheDocument())
  })

  it('stacks multiple toasts and dismisses the chosen one via the close button', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderWithProvider(
      <>
        <Trigger message="First" />
      </>,
    )

    await user.click(screen.getByRole('button', { name: 'fire' }))
    await user.click(screen.getByRole('button', { name: 'fire' }))

    expect(screen.getAllByText('First')).toHaveLength(2)

    const dismissButtons = screen.getAllByRole('button', { name: /dismiss notification/i })
    await user.click(dismissButtons[0])

    expect(screen.getAllByText('First')).toHaveLength(1)
  })

  it('falls back to a no-op when used outside of a provider', () => {
    function StandaloneTrigger() {
      const { show, dismiss } = useToast()
      return (
        <>
          <button type="button" onClick={() => show('ignored')}>
            show
          </button>
          <button type="button" onClick={() => dismiss(0)}>
            dismiss
          </button>
        </>
      )
    }

    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <StandaloneTrigger />
      </NextIntlClientProvider>,
    )

    expect(() => screen.getByRole('button', { name: 'show' }).click()).not.toThrow()
    expect(() => screen.getByRole('button', { name: 'dismiss' }).click()).not.toThrow()
    expect(screen.queryByText('ignored')).not.toBeInTheDocument()
  })
})
