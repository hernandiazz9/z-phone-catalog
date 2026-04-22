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

- **Every file is kebab-case**, including components:
  - ✅ `locale-switcher.tsx`, `use-cart.ts`, `format-price.ts`, `phone.types.ts`
  - ❌ `LocaleSwitcher.tsx`, `useCart.ts`, `formatPrice.ts`
- **Tests** live next to the file they test: `locale-switcher.test.tsx`.
- **Types** are co-located with the module that owns them as `*.types.ts`.
  Only move to `src/types/` when a type is genuinely cross-cutting.
- The only capitalised filenames allowed are the ones Next.js requires
  (`README.md`, `CLAUDE.md`, `AGENTS.md`) and the dynamic segments
  (`[locale]`, `[id]`, etc.).

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
- **One component per file.** Filename matches the exported component in
  kebab-case (`locale-switcher.tsx` exports `LocaleSwitcher`).
- **Function declarations** over arrow functions for components:
  ```text
  export function LocaleSwitcher() { ... }    // ✅
  export const LocaleSwitcher = () => { ... } // ❌
  ```
  Arrow functions are fine for inline callbacks and small utilities.

## 4. Server vs Client Components

- **Default to Server Components.** Add `'use client'` only when the file
  genuinely needs state, effects, event handlers or browser APIs.
- Data fetching happens on the server whenever possible. Client components
  should receive data as props, not fetch it themselves — unless it depends
  on runtime state (e.g. the cart in `localStorage`).
- Never import a Server Component from a Client Component.

## 5. Styling — Tailwind v4 only

- **No CSS modules, no styled-components, no inline `style={{}}`** unless
  genuinely dynamic (e.g. a computed colour from data).
- **Forbidden**: arbitrary values that dereference our own tokens.
  ```text
  className="text-[color:var(--color-muted)]"  // ❌ ugly and bypasses tokens
  className="rounded-[var(--radius-sm)]"       // ❌ same
  className="text-muted rounded-sm"            // ✅ use the utility
  ```
- All semantic colours live in `src/app/globals.css` under `@theme`. Adding
  a new colour means adding a token there first, then using the utility.
- Conditional / merged classes: use `clsx` + `tailwind-merge` (both installed).

## 6. i18n

- **No hardcoded user-facing strings in JSX.** Every visible string comes
  from `messages/{locale}.json`.
- Use `useTranslations(namespace)` in Client Components,
  `getTranslations({ locale, namespace })` in Server Components.
- Keys are nested by feature namespace: `home`, `phoneList`, `phoneDetail`,
  `cart`, `common`, `metadata`, `localeSwitcher`, ...
- **Navigation**: always import `Link`, `useRouter`, `usePathname`,
  `redirect` from `@/i18n/navigation`. Never from `next/link` or
  `next/navigation` (they don't know about the `[locale]` segment).

## 7. State management

- **React Context API** for global state (Zara challenge requirement). One
  provider per domain in `src/context/`.
- **Cart state persists in `localStorage`.** Use a `use-cart` hook that
  hydrates from storage on mount and writes on every change.
- Avoid prop-drilling more than two levels deep — if you do, reach for a
  context.

## 8. Imports

- Always use path aliases defined in `tsconfig.json`:
  `@/…`, `@components/…`, `@context/…`, `@hooks/…`, `@services/…`,
  `@types/…`, `@utils/…`, `@entities/…`.
- Never use `../../../foo`. One `../` is the limit.
- Order (ESLint handles it): node builtins → external packages → internal
  aliases → relative → styles.

## 9. Testing

- Vitest + React Testing Library + `@testing-library/jest-dom`.
- Every component with logic and every hook has at least one test.
- When rendering a Client Component that uses `useTranslations`, wrap with
  `NextIntlClientProvider` and pass a minimal messages object.
- Prefer `userEvent` over `fireEvent` for user interactions.

## 10. Accessibility

- All `jsx-a11y` ESLint rules must pass (no disables without a comment).
- Every interactive element has a discernible name (visible text or
  `aria-label`).
- Keyboard-only navigation must work end-to-end.
- `focus-visible` outline is already globally styled in `globals.css`;
  don't remove it.

## 11. Next.js 16 specifics

- The project runs Next.js 16, not 15 or earlier. Breaking changes include:
  - `middleware.ts` is renamed to `proxy.ts`.
  - `params` and `searchParams` are always `Promise<...>` — you must
    `await` them in Server Components.
  - Read the relevant doc in `node_modules/next/dist/docs/` before using
    an API you haven't touched yet in this codebase.

## 12. Commits & PRs

- **Conventional Commits** in English: `feat:`, `fix:`, `chore:`,
  `refactor:`, `test:`, `docs:`, `style:`, `perf:`.
- Subject under 72 characters, imperative mood, no trailing period.
- **Never** add `Co-Authored-By: Claude` or any AI-generated trailer.
  Commits are attributed to the human author only.
- Pre-commit hook (Husky + lint-staged) will run ESLint + Prettier on
  staged files — don't bypass with `--no-verify`.

## 13. Quality gates

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
