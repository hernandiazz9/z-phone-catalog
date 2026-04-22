'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { useParams } from 'next/navigation'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'

export function LocaleSwitcher() {
  const t = useTranslations('localeSwitcher')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const [isPending, startTransition] = useTransition()

  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as Locale
    startTransition(() => {
      router.replace(
        // @ts-expect-error - `params` is loosely typed by next/navigation
        { pathname, params },
        { locale: next },
      )
    })
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="sr-only">{t('label')}</span>
      <select
        aria-label={t('label')}
        value={locale}
        onChange={onChange}
        disabled={isPending}
        className="border-border bg-background focus-visible:outline-foreground rounded-sm border px-2 py-1 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {t(loc)}
          </option>
        ))}
      </select>
    </label>
  )
}
