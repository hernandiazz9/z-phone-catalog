'use client'

import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import { useId, useRef } from 'react'
import type { StorageOption } from '@/services/phones.types'

type Props = {
  options: StorageOption[]
  selected: StorageOption | null
  onSelect: (storage: StorageOption) => void
}

export function StorageSelector({ options, selected, onSelect }: Props) {
  const t = useTranslations('phoneDetail')
  const groupId = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  function handleKeyDown(event: React.KeyboardEvent, currentIndex: number) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const delta = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (currentIndex + delta + options.length) % options.length
    refs.current[nextIndex]?.focus()
    onSelect(options[nextIndex])
  }

  return (
    <div className="flex flex-col gap-3">
      <span id={groupId} className="tracking-label text-muted text-2xs uppercase">
        {t('storageLabel')}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={groupId}
        aria-label={t('storageGroupAriaLabel')}
        className="flex"
      >
        {options.map((option, index) => {
          const isSelected = selected?.capacity === option.capacity
          const isTabStop = isSelected || (!selected && index === 0)
          return (
            <button
              key={option.capacity}
              ref={(el) => {
                refs.current[index] = el
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isTabStop ? 0 : -1}
              onClick={() => onSelect(option)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={clsx(
                'focus-visible:outline-foreground bg-background text-foreground relative h-16 min-w-24 border px-6 text-xs uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
                index > 0 && '-ml-px',
                isSelected
                  ? 'border-foreground z-10'
                  : 'border-border hover:border-foreground hover:z-10',
              )}
            >
              {option.capacity}
            </button>
          )
        })}
      </div>
    </div>
  )
}
