'use client'

import { useTranslations } from 'next-intl'
import { useCart } from '@/context/cart-context'
import { Link } from '@/i18n/navigation'

export function CartIndicator() {
  const t = useTranslations('header')
  const { totalCount, isHydrated } = useCart()

  // Keep the server-rendered "0" until localStorage is read to avoid a
  // hydration mismatch when the persisted count differs from the initial
  // empty state.
  const displayCount = isHydrated ? totalCount : 0

  return (
    <Link
      href="/cart"
      aria-label={t('cartAriaLabel', { count: displayCount })}
      className="text-foreground focus-visible:outline-foreground inline-flex items-center gap-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 7h14l-1.2 12a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Z" />
        <path d="M9 7V5a3 3 0 0 1 6 0v2" />
      </svg>
      <span aria-hidden="true">{displayCount}</span>
    </Link>
  )
}
