'use client'

import { useTranslations } from 'next-intl'
import type { Toast } from '@/context/toast-context'

type Props = {
  toasts: Toast[]
  onDismiss: (id: number) => void
}

export function ToastStack({ toasts, onDismiss }: Props) {
  const t = useTranslations('toast')

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-foreground text-primary-foreground animate-toast-enter pointer-events-auto flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase shadow-lg"
        >
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label={t('dismissAriaLabel')}
            className="text-primary-foreground hover:text-muted-inverse focus-visible:outline-primary-foreground -m-1 p-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
