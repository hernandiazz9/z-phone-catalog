import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Next.js 16 renames the old `middleware.ts` entry point to `proxy.ts`.
// next-intl still ships its helper from `next-intl/middleware` and is
// compatible with the new convention.
export default createMiddleware(routing)

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
