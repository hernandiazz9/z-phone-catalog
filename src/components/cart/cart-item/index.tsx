'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { CartItem as CartItemModel } from '@/context/cart.types'
import { QuantityStepper } from './quantity-stepper'

type Props = {
  item: CartItemModel
  onRemove: () => void
  onIncrement: () => void
  onDecrement: () => void
}

export function CartItem({ item, onRemove, onIncrement, onDecrement }: Props) {
  const t = useTranslations('cart')
  const lineSubtotal = item.unitPrice * item.quantity

  return (
    <article className="tablet:gap-8 tablet:p-6 flex gap-4 p-4">
      <div className="tablet:w-40 desktop:w-48 relative aspect-square w-24 shrink-0">
        <Image
          src={item.imageUrl}
          alt={`${item.brand} ${item.name}`}
          fill
          sizes="(max-width: 768px) 96px, (max-width: 1280px) 160px, 192px"
          className="object-contain"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-foreground text-base uppercase">{item.name}</h2>
          <p className="text-muted text-xs tracking-widest uppercase">
            {t('itemSpecs', { storage: item.storageCapacity, color: item.colorName })}
          </p>
        </div>

        <div className="tablet:flex-row tablet:items-center tablet:gap-6 flex flex-col items-start gap-3">
          <QuantityStepper
            itemName={item.name}
            quantity={item.quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
          <span
            aria-label={t('lineSubtotalAriaLabel')}
            className="text-foreground tablet:ml-auto text-sm tracking-widest uppercase"
          >
            {t('priceLabel', { price: lineSubtotal })}
          </span>
        </div>

        <button
          type="button"
          onClick={onRemove}
          aria-label={t('removeAriaLabel', { name: item.name })}
          className="text-destructive focus-visible:outline-foreground self-start text-xs tracking-widest uppercase transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {t('remove')}
        </button>
      </div>
    </article>
  )
}
