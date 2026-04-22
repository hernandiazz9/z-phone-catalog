'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

export function BackLink() {
  const router = useRouter()
  const t = useTranslations('header')

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="text-foreground focus-visible:outline-foreground inline-flex items-center gap-1 text-sm tracking-[0.2em] uppercase focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      {t('back')}
    </button>
  )
}
