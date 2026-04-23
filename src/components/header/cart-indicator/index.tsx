'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCart } from '@/context/cart-context'
import { Link } from '@/i18n/navigation'

export function CartIndicator() {
  const t = useTranslations('header')
  const { totalCount, isHydrated } = useCart()

  const displayCount = isHydrated ? totalCount : 0

  const [pulseKey, setPulseKey] = useState(0)
  const prevCountRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isHydrated) return
    const prev = prevCountRef.current
    prevCountRef.current = totalCount
    if (prev === null) return
    if (totalCount > prev) {
      setPulseKey((k) => k + 1)
    }
  }, [totalCount, isHydrated])

  const isPulsing = pulseKey > 0

  return (
    <Link
      href="/cart"
      aria-label={t('cartAriaLabel', { count: displayCount })}
      className="text-foreground focus-visible:outline-foreground inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <svg
        key={`icon-${pulseKey}`}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={isPulsing ? 'animate-cart-icon-flash origin-center' : ''}
      >
        <path d="M5 7h14l-1.2 12a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Z" />
        <path d="M9 7V5a3 3 0 0 1 6 0v2" />
      </svg>
      <span
        key={`count-${pulseKey}`}
        aria-hidden="true"
        className={isPulsing ? 'animate-cart-bounce inline-block' : 'inline-block'}
      >
        {displayCount}
      </span>
    </Link>
  )
}
