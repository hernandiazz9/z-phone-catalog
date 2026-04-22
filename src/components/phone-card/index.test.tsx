import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import enMessages from '../../../messages/en.json'
import { PhoneCard } from '.'

vi.mock('next/image', () => ({
  default: ({
    priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} loading={priority ? 'eager' : 'lazy'} />
  ),
}))

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

const samplePhone = {
  id: 'APL-IP13-128',
  brand: 'Apple',
  name: 'iPhone 13',
  basePrice: 619,
  imageUrl: 'http://example.test/iphone.webp',
}

function renderCard(priority = false) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <PhoneCard phone={samplePhone} priority={priority} />
    </NextIntlClientProvider>,
  )
}

describe('phone-card', () => {
  it('renders brand, name and formatted price', () => {
    renderCard()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('iPhone 13')).toBeInTheDocument()
    expect(screen.getByText('619 EUR')).toBeInTheDocument()
  })

  it('links to the detail route of the phone', () => {
    renderCard()
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/phone/APL-IP13-128')
  })

  it('uses the phone name as image alt text', () => {
    renderCard()
    expect(screen.getByAltText('iPhone 13')).toBeInTheDocument()
  })

  it('lazy-loads the image by default', () => {
    renderCard()
    expect(screen.getByAltText('iPhone 13')).toHaveAttribute('loading', 'lazy')
  })

  it('eager-loads the image when priority is true', () => {
    renderCard(true)
    expect(screen.getByAltText('iPhone 13')).toHaveAttribute('loading', 'eager')
  })
})
