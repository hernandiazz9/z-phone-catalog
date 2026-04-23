'use client'

import { useTranslations } from 'next-intl'

type Props = {
  itemName: string
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
}

export function QuantityStepper({ itemName, quantity, onIncrement, onDecrement }: Props) {
  const t = useTranslations('cart')

  return (
    <div
      role="group"
      aria-label={t('quantityAriaLabel', { name: itemName })}
      className="border-border text-foreground inline-flex h-10 items-stretch border"
    >
      <button
        type="button"
        onClick={onDecrement}
        aria-label={t('decreaseAriaLabel', { name: itemName })}
        className="hover:bg-foreground hover:text-primary-foreground focus-visible:outline-foreground flex w-10 items-center justify-center text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        −
      </button>
      <span
        aria-live="polite"
        className="border-border tracking-label flex min-w-10 items-center justify-center border-x px-3 text-sm tabular-nums"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label={t('increaseAriaLabel', { name: itemName })}
        className="hover:bg-foreground hover:text-primary-foreground focus-visible:outline-foreground flex w-10 items-center justify-center text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        +
      </button>
    </div>
  )
}
