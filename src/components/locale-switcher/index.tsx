'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { useParams } from 'next/navigation'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'

export function LocaleSwitcher() {
  const t = useTranslations('localeSwitcher')
  const current = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const [isPending, startTransition] = useTransition()

  function switchTo(next: Locale) {
    if (next === current) return
    startTransition(() => {
      router.replace(
        // @ts-expect-error - `params` is loosely typed by next/navigation
        { pathname, params },
        { locale: next },
      )
    })
  }

  return (
    <div
      role="group"
      aria-label={t('label')}
      className="tracking-label text-xs uppercase"
      data-pending={isPending || undefined}
    >
      {routing.locales.map((loc, index) => {
        const isActive = loc === current
        return (
          <span key={loc}>
            <button
              type="button"
              onClick={() => switchTo(loc)}
              aria-pressed={isActive}
              disabled={isPending}
              className={
                isActive
                  ? 'text-foreground decoration-foreground underline underline-offset-4'
                  : 'text-muted hover:text-foreground focus-visible:outline-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'
              }
            >
              {loc}
            </button>
            {index < routing.locales.length - 1 ? (
              <span aria-hidden="true" className="text-muted mx-2">
                ·
              </span>
            ) : null}
          </span>
        )
      })}
    </div>
  )
}
