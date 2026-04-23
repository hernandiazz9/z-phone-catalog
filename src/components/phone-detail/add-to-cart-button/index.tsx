'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { animation } from '@/config/animation'
import { useCart } from '@/context/cart-context'
import type { ColorOption, Phone, StorageOption } from '@/services/phones.types'

type Props = {
  phone: Pick<Phone, 'id' | 'brand' | 'name'>
  color: ColorOption | null
  storage: StorageOption | null
}

export function AddToCartButton({ phone, color, storage }: Props) {
  const t = useTranslations('phoneDetail')
  const { addItem } = useCart()
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

const PARTICLE_COUNT = 40
const PALETTE = [
  '#ffffff',
  '#fbbf24',
  '#22c55e',
  '#3b82f6',
  '#ec4899',
  '#dc2626',
  '#a855f7',
  '#f97316',
]

type Particle = {
  i: number
  burstX: number
  burstY: number
  drift: number
  rotation: number
  width: number
  height: number
  color: string
  delay: number
}

// Pre-computed at module load: React's purity rule forbids Math.random in render.
const PARTICLES: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.sin(i * 7.3) * 0.35
  const distance = 90 + Math.cos(i * 3.1) * 60
  const burstX = Math.cos(angle) * distance
  const burstY = Math.sin(angle) * distance
  const drift = Math.sin(i * 2.1) * 50
  const rotation = 360 + ((i * 47) % 540)
  const width = 8 + ((i * 3) % 8)
  const height = width * (i % 3 === 0 ? 2 : 1)
  const color = PALETTE[i % PALETTE.length]
  const delay = (i * 7) % 120
  return { i, burstX, burstY, drift, rotation, width, height, color, delay }
})

function ConfettiBurst() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {PARTICLES.map((p) => (
        <span
          key={p.i}
          className="animate-confetti absolute top-1/2 left-1/2 rounded-[2px]"
          style={
            {
              width: `${p.width}px`,
              height: `${p.height}px`,
              backgroundColor: p.color,
              animationDelay: `${p.delay}ms`,
              '--confetti-burst-x': `${p.burstX}px`,
              '--confetti-burst-y': `${p.burstY}px`,
              '--confetti-drift': `${p.drift}px`,
              '--confetti-rotation': `${p.rotation}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  )
}
