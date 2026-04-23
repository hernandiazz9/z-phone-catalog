import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import enMessages from '../../../../messages/en.json'
import { CartSummary } from '.'

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

function renderSummary(totalPrice = 1099) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <CartSummary totalPrice={totalPrice} />
    </NextIntlClientProvider>,
  )
}

describe('cart-summary', () => {
  it('renders the total formatted with the EUR suffix', () => {
    renderSummary(1299)
    expect(screen.getByText('1299 EUR')).toBeInTheDocument()
  })

  it('exposes a "Continue shopping" link pointing to the catalog', () => {
    renderSummary()
    const link = screen.getByRole('link', { name: /continue shopping/i })
    expect(link).toHaveAttribute('href', '/')
  })

  it('exposes a "Pay" button (stub, no handler yet)', () => {
    renderSummary()
    expect(screen.getByRole('button', { name: /pay/i })).toBeEnabled()
  })
})
