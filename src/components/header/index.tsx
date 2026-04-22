import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { CartIndicator } from './cart-indicator'
import { LocaleSwitcher } from '../locale-switcher'

export async function Header() {
  const t = await getTranslations('header')

  return (
    <header className="border-border bg-background w-full border-b">
      <div className="max-w-page mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-10 2xl:px-25">
        <Link
          href="/"
          aria-label={t('homeAriaLabel')}
          className="text-foreground focus-visible:outline-foreground tracking-brand inline-flex items-center gap-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className="bg-foreground inline-block h-2 w-2 rounded-full" aria-hidden="true" />
          <span>MBST</span>
        </Link>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <CartIndicator />
        </div>
      </div>
    </header>
  )
}
