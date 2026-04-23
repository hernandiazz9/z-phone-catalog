'use client'

import { useEffect, useRef } from 'react'

type Props = { children: React.ReactNode; ariaLabel: string }

export function Slider({ children, ariaLabel }: Props) {
  const ref = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function onWheel(event: WheelEvent) {
      if (!el) return
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      event.preventDefault()
      el.scrollLeft += event.deltaY
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  return (
    <ul
      ref={ref}
      aria-label={ariaLabel}
      className="bg-border flex snap-x snap-mandatory gap-px overflow-x-auto"
    >
      {children}
    </ul>
  )
}
