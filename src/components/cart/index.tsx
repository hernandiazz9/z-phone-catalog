'use client'

import { useTranslations } from 'next-intl'
import { useCart } from '@/context/cart-context'
import { CartItem } from './cart-item'
import { CartSummary } from './cart-summary'
import { EmptyCart } from './empty-cart'

export function CartView() {
  const t = useTranslations('cart')
  const { items, totalCount, totalPrice, isHydrated, removeItem, incrementItem, decrementItem } =
    useCart()

  if (!isHydrated) {
    return (
      <div className="flex flex-col gap-10" aria-busy="true" aria-live="polite">
        <div className="bg-surface h-6 w-40 animate-pulse" />
        <div className="bg-surface h-40 w-full animate-pulse" />
      </div>
    )
  }

  if (items.length === 0) {
    return <EmptyCart />
  }

  return (
    <section className="flex flex-col gap-10">
      <h1 className="text-foreground text-xl tracking-widest uppercase">
        {t('title', { count: totalCount })}
      </h1>
      <ul className="bg-border flex flex-col gap-px">
        {items.map((item) => (
          <li key={item.key} className="bg-background">
            <CartItem
              item={item}
              onRemove={() => removeItem(item.key)}
              onIncrement={() => incrementItem(item.key)}
              onDecrement={() => decrementItem(item.key)}
            />
          </li>
        ))}
      </ul>
      <CartSummary totalPrice={totalPrice} />
    </section>
  )
}
