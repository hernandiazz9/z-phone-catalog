'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ConfettiBurst } from '@/components/confetti-burst'
import { animation } from '@/config/animation'
import { useCart } from '@/context/cart-context'
import type { ColorOption, Phone, PhoneListItem, StorageOption } from '@/services/phones.types'
import { VariantPickerModal } from './variant-picker-modal'

type Props = {
  phone: Pick<PhoneListItem, 'id' | 'brand' | 'name'>
}

async function fetchPhoneDetail(id: string): Promise<Phone | null> {
  const response = await fetch(`/api/phones/${encodeURIComponent(id)}`)
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Failed to fetch phone ${id}`)
  return (await response.json()) as Phone
}

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'picking'; detail: Phone }
  | { kind: 'added' }

export function QuickAddButton({ phone }: Props) {
  const t = useTranslations('phoneList')
  const { addItem } = useCart()
  const [state, setState] = useState<State>({ kind: 'idle' })
  const [burstId, setBurstId] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function triggerAdded(color: ColorOption, storage: StorageOption) {
    addItem({ phone: { id: phone.id, brand: phone.brand, name: phone.name }, color, storage })
    setState({ kind: 'added' })
    setBurstId((k) => k + 1)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setState({ kind: 'idle' }), animation.addToCartFeedback)
  }

  async function handleClick(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (state.kind === 'loading' || state.kind === 'picking') return

    setState({ kind: 'loading' })
    try {
      const detail = await fetchPhoneDetail(phone.id)
      const colors = detail?.colorOptions ?? []
      const storages = detail?.storageOptions ?? []
      if (colors.length === 0 || storages.length === 0) {
        setState({ kind: 'idle' })
        return
      }
      if (colors.length === 1 && storages.length === 1) {
        triggerAdded(colors[0], storages[0])
        return
      }
      setState({ kind: 'picking', detail: detail as Phone })
    } catch {
      setState({ kind: 'idle' })
    }
  }

  const ariaLabel =
    state.kind === 'added'
      ? t('quickAddedAriaLabel', { name: phone.name })
      : t('quickAddAriaLabel', { name: phone.name })

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={state.kind === 'loading'}
        aria-label={ariaLabel}
        className="bg-background text-foreground border-border hover:bg-foreground hover:text-primary-foreground hover:border-foreground focus-visible:outline-foreground relative inline-flex h-10 w-10 items-center justify-center overflow-visible rounded-full border shadow-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-70"
      >
        {state.kind === 'added' ? (
          <CheckIcon />
        ) : state.kind === 'loading' ? (
          <Spinner />
        ) : (
          <PlusIcon />
        )}
        {state.kind === 'added' ? <ConfettiBurst key={burstId} variant="small" /> : null}
      </button>

      {state.kind === 'picking' ? (
        <VariantPickerModal
          phone={state.detail}
          open
          onClose={() => setState({ kind: 'idle' })}
          onConfirm={({ color, storage }) => triggerAdded(color, storage)}
        />
      ) : null}
    </>
  )
}

function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="5 12 10 17 19 8" />
    </svg>
  )
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="border-border border-t-foreground h-4 w-4 animate-spin rounded-full border-2"
    />
  )
}
