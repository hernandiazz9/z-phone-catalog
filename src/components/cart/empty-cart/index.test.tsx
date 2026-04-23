import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import enMessages from '../../../../messages/en.json'
import { EmptyCart } from '.'

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

function renderEmpty() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <EmptyCart />
    </NextIntlClientProvider>,
  )
}

describe('empty-cart', () => {
  it('renders the empty-state title and body', () => {
    renderEmpty()
    expect(screen.getByRole('heading', { name: /your cart is empty/i })).toBeInTheDocument()
    expect(screen.getByText(/browse the catalog/i)).toBeInTheDocument()
  })

  it('links back to the catalog', () => {
    renderEmpty()
    expect(screen.getByRole('link', { name: /continue shopping/i })).toHaveAttribute('href', '/')
  })
})
