import { animation } from '@/config/animation'

export function AnimationRootVars() {
  const css = `:root {
  --animate-confetti: confetti ${animation.confetti}ms ease-out forwards;
  --animate-cart-bounce: cart-bounce ${animation.cartBadgeBounce}ms ease-in-out;
  --animate-cart-icon-flash: cart-icon-flash ${animation.cartIconFlash}ms ease-in-out;
  --animate-card-enter: card-enter ${animation.cardEnter}ms ease-out both;
  --animate-shimmer: shimmer ${animation.shimmer}ms linear infinite;
  --animate-search-progress: search-progress ${animation.searchProgress}ms linear forwards;
}`
  return <style>{css}</style>
}
