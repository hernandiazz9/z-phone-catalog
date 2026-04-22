'use client'

import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import { useId, useRef } from 'react'
import type { ColorOption } from '@/services/phones.types'

type Props = {
  options: ColorOption[]
  selected: ColorOption | null
  onSelect: (color: ColorOption) => void
}

export function ColorSelector({ options, selected, onSelect }: Props) {
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
        {t('colorLabel')}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={groupId}
        aria-label={t('colorGroupAriaLabel')}
        className="flex flex-wrap items-center gap-3"
      >
        {options.map((option, index) => {
          const isSelected = selected?.name === option.name
          const isTabStop = isSelected || (!selected && index === 0)
          return (
            <button
              key={option.name}
              ref={(el) => {
                refs.current[index] = el
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={option.name}
              tabIndex={isTabStop ? 0 : -1}
              onClick={() => onSelect(option)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={clsx(
                'focus-visible:outline-foreground relative h-6 w-6 border transition-shadow duration-200 focus-visible:outline-2 focus-visible:outline-offset-4',
                isSelected
                  ? 'ring-foreground border-transparent ring-1 ring-offset-2'
                  : 'border-border',
              )}
              style={{ backgroundColor: option.hexCode }}
            />
          )
        })}
      </div>
      <span className="tracking-label text-muted text-2xs min-h-[1em] uppercase" aria-live="polite">
        {selected?.name ?? ''}
      </span>
    </div>
  )
}
