'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function EmptyCart() {
  const t = useTranslations('cart')

  return (
    <section className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <h1 className="text-foreground text-xl tracking-widest uppercase">{t('emptyTitle')}</h1>
      <p className="text-muted max-w-md text-sm">{t('emptyBody')}</p>
      <Link
        href="/"
        className="border-foreground text-foreground hover:bg-foreground hover:text-primary-foreground focus-visible:outline-foreground mt-4 inline-flex h-14 items-center justify-center border px-8 text-xs tracking-widest uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {t('continueShopping')}
      </Link>
    </section>
  )
}
