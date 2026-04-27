'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

type Props = {
  totalPrice: number
}

export function CartSummary({ totalPrice }: Props) {
  const t = useTranslations('cart')

  return (
    <footer className="border-border bg-background fixed right-0 bottom-0 left-0 z-30 border-t">
      <div className="max-w-page tablet:px-6 tablet:py-5 tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-8 desktop:px-10 wide:px-25 mx-auto flex flex-col gap-4 px-4 py-4">
        <div className="tablet:order-2 tablet:items-center order-1 flex items-baseline justify-between gap-4">
          <span className="text-muted text-xs tracking-widest uppercase">{t('total')}</span>
          <span className="text-foreground tablet:text-sm tablet:font-normal tablet:tracking-widest text-2xl font-bold tracking-tight uppercase">
            {t('priceLabel', { price: totalPrice })}
          </span>
        </div>

        <div className="tablet:contents order-2 flex">
          <Link
            href="/"
            className="border-foreground text-foreground hover:bg-foreground hover:text-primary-foreground focus-visible:outline-foreground tablet:order-1 tablet:flex-none tablet:px-8 inline-flex h-14 flex-1 items-center justify-center border text-xs tracking-widest uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t('continueShopping')}
          </Link>
          <button
            type="button"
            className="bg-foreground text-primary-foreground hover:bg-highlight focus-visible:outline-foreground tablet:order-3 tablet:ml-0 tablet:flex-none tablet:px-10 -ml-px h-14 flex-1 text-xs tracking-widest uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t('pay')}
          </button>
        </div>
      </div>
    </footer>
  )
}
