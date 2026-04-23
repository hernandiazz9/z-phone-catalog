type Variant = 'default' | 'small'

type Props = {
  variant?: Variant
}

type Particle = {
  i: number
  burstX: number
  burstY: number
  drift: number
  fall: number
  rotation: number
  width: number
  height: number
  color: string
  delay: number
}

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

function makeParticles(count: number, scale: number, fall: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + Math.sin(i * 7.3) * 0.35
    const baseDistance = 90 + Math.cos(i * 3.1) * 60
    const distance = baseDistance * scale
    const burstX = Math.cos(angle) * distance
    const burstY = Math.sin(angle) * distance
    const drift = Math.sin(i * 2.1) * 50 * scale
    const baseWidth = 8 + ((i * 3) % 8)
    const width = baseWidth * scale
    const height = width * (i % 3 === 0 ? 2 : 1)
    const rotation = 360 + ((i * 47) % 540)
    const color = PALETTE[i % PALETTE.length]
    const delay = (i * 7) % 120
    return { i, burstX, burstY, drift, fall, rotation, width, height, color, delay }
  })
}

// Pre-computed at module load: React's purity rule forbids Math.random in render.
const PARTICLES_DEFAULT = makeParticles(40, 1, 240)
const PARTICLES_SMALL = makeParticles(18, 0.55, 110)

export function ConfettiBurst({ variant = 'default' }: Props) {
  const particles = variant === 'small' ? PARTICLES_SMALL : PARTICLES_DEFAULT
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {particles.map((p) => (
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
              '--confetti-fall': `${p.fall}px`,
              '--confetti-rotation': `${p.rotation}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  )
}
