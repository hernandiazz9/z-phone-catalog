'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ConfettiBurst } from '@/components/confetti-burst'
import { animation } from '@/config/animation'
import { useCart } from '@/context/cart-context'
import { useToast } from '@/context/toast-context'
import type { ColorOption, Phone, StorageOption } from '@/services/phones.types'

type Props = {
  phone: Pick<Phone, 'id' | 'brand' | 'name'>
  color: ColorOption | null
  storage: StorageOption | null
}

export function AddToCartButton({ phone, color, storage }: Props) {
  const t = useTranslations('phoneDetail')
  const tToast = useTranslations('toast')
  const { addItem } = useCart()
  const { show: showToast } = useToast()
  const [justAdded, setJustAdded] = useState(false)
  const [burstId, setBurstId] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const disabled = !color || !storage

  function handleClick() {
    if (!color || !storage) return
    addItem({ phone, color, storage })
    showToast(tToast('added'))
    setJustAdded(true)
    setBurstId((k) => k + 1)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setJustAdded(false), animation.addToCartFeedback)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-live="polite"
      className="focus-visible:outline-foreground bg-foreground text-primary-foreground hover:bg-highlight disabled:bg-border disabled:text-muted relative h-14 w-full overflow-visible text-sm tracking-widest uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed"
    >
      {justAdded ? t('addedToCart') : t('addToCart')}
      {justAdded ? <ConfettiBurst key={burstId} /> : null}
    </button>
  )
}
