'use client'

import { useRef, useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { animation } from '@/config/animation'
import { usePathname, useRouter } from '@/i18n/navigation'

export function SearchBar() {
  const t = useTranslations('phoneList')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [value, setValue] = useState(() => searchParams.get('search') ?? '')
  const [isPending, startTransition] = useTransition()
  const [isWaiting, setIsWaiting] = useState(false)
  const [progressKey, setProgressKey] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function updateUrl(next: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (next.trim()) {
      params.set('search', next.trim())
    } else {
      params.delete('search')
    }
    const query = params.toString()
    const url = query ? `${pathname}?${query}` : pathname
    startTransition(() => {
      router.replace(url, { scroll: false })
    })
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.value
    setValue(next)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setIsWaiting(true)
    setProgressKey((k) => k + 1)
    debounceRef.current = setTimeout(() => {
      setIsWaiting(false)
      updateUrl(next)
    }, animation.searchDebounce)
  }

  function onClear() {
    setValue('')
    setIsWaiting(false)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    updateUrl('')
  }

  const showProgress = isWaiting || isPending

  return (
    <div className="border-border relative w-full border-b">
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={t('searchPlaceholder')}
        aria-label={t('searchAriaLabel')}
        autoComplete="off"
        className="text-muted placeholder:text-muted focus:text-foreground tracking-label w-full bg-transparent py-5 pr-10 text-sm uppercase outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          aria-label={t('clearSearchAriaLabel')}
          className="text-muted hover:text-foreground focus-visible:outline-foreground absolute inset-y-0 right-0 flex items-center px-2 focus-visible:outline-2 focus-visible:outline-offset-2"
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
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
      ) : null}
      {showProgress ? (
        <span
          key={progressKey}
          aria-hidden="true"
          className={`bg-foreground animate-search-progress absolute right-0 -bottom-px left-0 h-px origin-left ${isPending ? 'animate-pulse' : ''}`}
        />
      ) : null}
    </div>
  )
}
