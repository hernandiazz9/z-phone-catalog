/**
 * Single source of truth for every animation timing in the app. All values
 * are milliseconds. Tweak a duration here and both the JS timers and the
 * CSS `--animate-*` tokens update — CSS side is derived via the
 * `<AnimationRootVars />` component rendered in the locale layout.
 *
 * CSS-side keyframes (shapes of the animations) still live in
 * src/app/globals.css. Only the durations are centralised.
 */
export const animation = {
  addToCartFeedback: 1600,
  confetti: 1500,

  cartBadgeBounce: 400,
  cartIconFlash: 600,

  cardEnter: 380,
  cardStaggerStep: 35,
  cardStaggerMaxIndex: 10,

  searchDebounce: 500,
  searchProgress: 500,

  shimmer: 1600,
} as const
