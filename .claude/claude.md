# Project conventions — z-phone-catalog

Rules every agent working on this repo must follow. Short by design; if
something isn't covered here, default to the patterns already visible in the
codebase and ask before inventing a new one.

---

## 0. Source of truth

- **The challenge PDF is the source of truth.** It dictates requirements,
  APIs, font families, acceptance criteria, everything. If the PDF
  specifies something, that's the rule — no exceptions.
- **Figma is visual inspiration only.** Use it to match spacing, colours,
  layout and interaction patterns, but never to override what the PDF
  dictates. Example: the PDF says `font-family: Helvetica, Arial, sans-serif;`
  → that's what we use, even if Figma shows a proprietary font.
- When PDF and Figma conflict, PDF wins. When Figma adds detail the PDF
  doesn't cover, Figma fills the gap.

## 1. File & folder naming

- **Every file and folder is kebab-case**:
  - ✅ `locale-switcher`, `use-cart`, `format-price`, `phone.types`
  - ❌ `LocaleSwitcher`, `useCart`, `formatPrice`
- **Every React component lives in its own folder** with `index.tsx` as
  the primary file. This applies **recursively** — sub-components of a
  feature live in folders **inside** the parent feature folder, not as
  flat sibling `.tsx` files. No exceptions, no "I'll just drop a quick
  file next to it". Consistency beats convenience.

  ```
  src/components/phone-detail/
  ├── index.tsx                   the PhoneDetail orchestrator
  ├── add-to-cart-button/
  │   ├── index.tsx               the AddToCartButton component
  │   └── index.test.tsx          test in the same folder, named index.test.tsx
  ├── color-selector/
  │   ├── index.tsx
  │   └── index.test.tsx
  ├── specs-table/
  │   └── index.tsx               tests are optional, the folder is not
  └── …
  ```

  Rationale: if some components are folders and others are flat `.tsx`
  files, the repo slowly rots into two mental models. Pick one and stick
  to it at every nesting level.

- **Tests** live next to the file they test, named `index.test.tsx`
  (or `index.test.ts` for non-JSX modules). Same folder — never a
  separate `__tests__/` directory.
- **Types** are co-located with the module that owns them as `*.types.ts`.
  Only move to `src/types/` when a type is genuinely cross-cutting.
- **Non-component modules** (services, utils, hooks, context) follow the
  same folder-per-module pattern whenever they have co-located tests,
  types, or sub-files. A standalone one-file util can stay flat, but the
  moment it gains a test or a `.types.ts`, fold it into a folder.
- The only capitalised filenames allowed are the ones Next.js / tooling
  requires (`README.md`, `CLAUDE.md`, `AGENTS.md`) and the dynamic
  segments (`[locale]`, `[id]`, etc.).

## 2. Folder structure (under `src/`)

```
src/
├── app/[locale]/            Next.js App Router, always under [locale]
├── components/              Reusable UI (no feature-specific logic)
├── context/                 React Context providers (cart, etc.)
├── hooks/                   Reusable hooks (use-*)
├── i18n/                    next-intl config (routing, request, navigation)
├── services/                API clients, data fetchers
├── utils/                   Pure helpers (no React)
└── proxy.ts                 next-intl middleware (was middleware.ts in Next 15)
```

## 3. Exports & component style

- **Named exports only.** `export default` is reserved for the files Next.js
  requires it (`page.tsx`, `layout.tsx`, `not-found.tsx`, `error.tsx`,
  `loading.tsx`, `proxy.ts`, `next.config.ts`).
- **One component per file.** The component's **folder name** (kebab-case)
  matches the exported name (PascalCase): `locale-switcher/index.tsx`
  exports `LocaleSwitcher`.
- **Function declarations** over arrow functions for components:
  ```text
  export function LocaleSwitcher() { ... }    // ✅
  export const LocaleSwitcher = () => { ... } // ❌
  ```
  Arrow functions are fine for inline callbacks and small utilities.

## 4. Code style — language & comments

- **Everything in the codebase is in English.** Identifiers, file names,
  comments, JSDoc, commit messages, error strings, test descriptions, log
  output — all English. The **only** exception is user-facing copy, which
  lives in `messages/{locale}.json` (Spanish, English, and any future
  locale).
- **No comments unless genuinely useful.** Prefer clear names over
  comments. A comment is only justified when it explains **why** (a
  non-obvious decision, a workaround, a spec reference, a gotcha), never
  **what** the code does.
- Bad comment (restates the code):
  ```ts
  // increment counter
  counter += 1
  ```
- Good comment (explains a decision / constraint):
  ```ts
  // Challenge PDF forces server-side search; revalidate: false keeps
  // keystroke responses fresh without trashing the ISR cache.
  revalidate: search ? false : DEFAULT_REVALIDATE_SECONDS
  ```

## 5. Server vs Client Components

- **Default to Server Components.** Add `'use client'` only when the file
  genuinely needs state, effects, event handlers or browser APIs.
- Data fetching happens on the server whenever possible. Client components
  should receive data as props, not fetch it themselves — unless it depends
  on runtime state (e.g. the cart in `localStorage`).
- Never import a Server Component from a Client Component.

## 6. Styling — Tailwind v4 only

- **No CSS modules, no styled-components, no inline `style={{}}`** unless
  genuinely dynamic (e.g. a computed colour from data).
- **Prefer built-in Tailwind utilities** over arbitrary values `[...]`.
  Before writing `duration-[400ms]`, check whether `duration-300`,
  `duration-500`, etc. already exist. Before writing `tracking-[0.1em]`,
  check whether `tracking-widest` does the job. Tailwind v4's spacing
  scale is dynamic — `px-25` = 100px works out of the box.
- **If a value is part of the design system and no built-in matches**,
  add a token to `@theme` in `src/app/globals.css` and use the named
  utility it generates. `tracking-[0.25em]` repeated 3× means you need
  `--tracking-brand: 0.25em` → `tracking-brand`.
- **Arbitrary values `[...]` are a last resort**, only acceptable for
  genuinely one-off values that aren't worth a token.
- **Forbidden**: arbitrary values that dereference our own tokens.
  ```text
  className="text-[color:var(--color-muted)]"  // ❌ ugly and bypasses tokens
  className="rounded-[var(--radius-sm)]"       // ❌ same
  className="text-muted rounded-sm"            // ✅ use the utility
  ```
- All semantic colours live in `src/app/globals.css` under `@theme`. Adding
  a new colour means adding a token there first, then using the utility.
- Conditional / merged classes: use `clsx` + `tailwind-merge` (both installed).

## 7. i18n

- **No hardcoded user-facing strings in JSX.** Every visible string comes
  from `messages/{locale}.json`.
- Use `useTranslations(namespace)` in Client Components,
  `getTranslations({ locale, namespace })` in Server Components.
- Keys are nested by feature namespace: `home`, `phoneList`, `phoneDetail`,
  `cart`, `common`, `metadata`, `localeSwitcher`, ...
- **Navigation**: always import `Link`, `useRouter`, `usePathname`,
  `redirect` from `@/i18n/navigation`. Never from `next/link` or
  `next/navigation` (they don't know about the `[locale]` segment).

## 8. State management

- **React Context API** for global state (Zara challenge requirement). One
  provider per domain in `src/context/`. Existing providers:
  - [`cart-context.tsx`](src/context/cart-context.tsx) — exports
    `CartProvider` and `useCart`. Persists to `localStorage` and exposes
    an `isHydrated` flag (see §15).
  - [`toast-context.tsx`](src/context/toast-context.tsx) — exports
    `ToastProvider` and `useToast`. The hook returns a no-op when used
    outside the provider on purpose (see §15).
- **Cart state persists in `localStorage`.** Hydration happens after mount
  via the `isHydrated` flag, never as initial state — see §15.
- Avoid prop-drilling more than two levels deep — if you do, reach for a
  context.

## 9. Imports

- Always use path aliases defined in `tsconfig.json`:
  `@/…`, `@components/…`, `@context/…`, `@hooks/…`, `@services/…`,
  `@types/…`, `@utils/…`, `@entities/…`.
- Never use `../../../foo`. One `../` is the limit.
- Order (ESLint handles it): node builtins → external packages → internal
  aliases → relative → styles.

## 10. Testing

- Vitest + React Testing Library + `@testing-library/jest-dom`.
- Every component with logic and every hook has at least one test.
- When rendering a Client Component that uses `useTranslations`, wrap with
  `NextIntlClientProvider` and pass a minimal messages object.
- Prefer `userEvent` over `fireEvent` for user interactions.

## 11. Accessibility

- All `jsx-a11y` ESLint rules must pass (no disables without a comment).
- Every interactive element has a discernible name (visible text or
  `aria-label`).
- Keyboard-only navigation must work end-to-end.
- `focus-visible` outline is already globally styled in `globals.css`;
  don't remove it.
- **Skip link** lives in [`src/components/skip-link/`](src/components/skip-link/).
  Invisible until focused, jumps to `#main-content`. Every `<main>`
  carries that id — don't change one end without the other.
- **Live announcements:** use `aria-live="polite"` on counters and totals
  that change at runtime (cart count, search results, line subtotals).
  Use `aria-busy="true"` on buttons or regions that are temporarily
  disabled by an in-flight action (see the `quick-add-button` loading
  state for the pattern).
- **Modals**: native `<dialog>` + `dialogRef.current.showModal()` (focus
  trap and Esc-to-close come for free). Always add `aria-modal="true"`
  explicitly and `aria-labelledby` pointing to the dialog heading.
- **WCAG 2.5.3 (Label in Name)**: when an element has visible text, the
  accessible name must start with that text. Don't add an `aria-label`
  that contradicts the visible label (the header logo learnt this the
  hard way — see commit history).

## 12. Next.js 16 specifics

- The project runs Next.js 16, not 15 or earlier. Breaking changes include:
  - `middleware.ts` is renamed to `proxy.ts`.
  - `params` and `searchParams` are always `Promise<...>` — you must
    `await` them in Server Components.
  - Read the relevant doc in `node_modules/next/dist/docs/` before using
    an API you haven't touched yet in this codebase.

## 13. Commits & PRs

- **Conventional Commits** in English: `feat:`, `fix:`, `chore:`,
  `refactor:`, `test:`, `docs:`, `style:`, `perf:`.
- Subject under 72 characters, imperative mood, no trailing period.
- **Never** add `Co-Authored-By: Claude` or any AI-generated trailer.
  Commits are attributed to the human author only.
- Pre-commit hook (Husky + lint-staged) will run ESLint + Prettier on
  staged files — don't bypass with `--no-verify`.

## 14. Animations

Animation timings live in **one place** to keep the UI feeling cohesive
and to avoid JS timers and CSS keyframes drifting apart. To add a new
animation, touch three files:

1. **[`src/config/animation.ts`](src/config/animation.ts)** — add the
   duration in milliseconds (single source of truth).
2. **[`src/app/globals.css`](src/app/globals.css)** — add the `@keyframes`
   block and a matching `--animate-*` token under `@theme`. The token
   makes Tailwind generate the `animate-*` utility (e.g. `animate-toast-enter`).
3. **[`src/components/animation-root-vars/`](src/components/animation-root-vars/)**
   — add a runtime override that re-declares the same `--animate-*`
   variable using the JS-side duration. This component is rendered once
   in the locale layout, so a single config change propagates to both
   JS timers and CSS animations.

Why three places: keyframes are static (CSS), durations vary by
config (JS), Tailwind needs the token to generate utilities. The
`AnimationRootVars` indirection is what keeps JS and CSS in sync.

## 15. Internal patterns / gotchas

Things that aren't deducible from the code alone:

- **`isHydrated` flag for `localStorage` state.** The cart starts as `[]`
  on the server and hydrates from `localStorage` after mount. Components
  that depend on cart data check `isHydrated` first and render a skeleton
  with `aria-busy="true"` until hydration finishes. This avoids
  SSR/CSR mismatch warnings. **Don't read `localStorage` in initial
  state** — it'll diverge between server and client.

- **`useToast` no-op fallback.** `useToast()` outside of a `ToastProvider`
  returns `{ show: () => {}, dismiss: () => {} }` instead of throwing.
  This is deliberate: it lets isolated component tests skip wrapping with
  `ToastProvider`. Don't "fix" it by throwing — you'll break unrelated
  tests across the suite.

- **Server-only services vs client route handlers.**
  [`src/services/phones.service.ts`](src/services/phones.service.ts)
  imports `'server-only'` and uses the `x-api-key` directly. RSC pages
  call it. Client components hit
  [`src/app/api/phones/[id]/route.ts`](src/app/api/phones/[id]/route.ts),
  which proxies to the same service server-side. **Never expose the API
  key to the client** — that's why the proxy exists in the first place.

- **`tablet:contents` for dual-layout footers.** The cart summary uses
  `display: contents` on tablet+ to drop a wrapping `<div>` from the flex
  flow, so a single piece of markup renders as stacked-mobile and
  3-column-desktop without duplication. See
  [`src/components/cart/cart-summary/index.tsx`](src/components/cart/cart-summary/index.tsx).
  Pattern is reusable when a wrapper exists only for mobile layout.

- **`PRIORITY_IMAGE_COUNT = 1` in the listing.** Only the first card has
  `priority` to avoid the `preloaded but not used` browser warning when
  navigating away. Don't bump it without a real LCP win.

## 16. Quality gates

Before declaring any task done, these must pass:

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # eslint --max-warnings=0
npm run format:check # prettier --check
npm run test         # vitest run
npm run build        # next build
```

---

_This file is loaded automatically by Claude Code via the root `CLAUDE.md`._
