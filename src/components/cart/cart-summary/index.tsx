'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

type Props = {
  totalPrice: number
}

export function CartSummary({ totalPrice }: Props) {
  const t = useTranslations('cart')

  return (
    <footer className="border-border tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-6 border-t pt-8">
      <Link
        href="/"
        className="border-foreground text-foreground hover:bg-foreground hover:text-primary-foreground focus-visible:outline-foreground inline-flex h-14 items-center justify-center border px-8 text-xs tracking-widest uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {t('continueShopping')}
      </Link>

      <div className="flex items-center gap-4">
        <span className="text-muted text-xs tracking-widest uppercase">{t('total')}</span>
        <span className="text-foreground text-sm tracking-widest uppercase">
          {t('priceLabel', { price: totalPrice })}
        </span>
      </div>

      <button
        type="button"
        className="bg-foreground text-primary-foreground hover:bg-highlight focus-visible:outline-foreground h-14 px-10 text-xs tracking-widest uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {t('pay')}
      </button>
    </footer>
  )
}
