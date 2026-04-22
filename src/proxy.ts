import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// En Next.js 16 el antiguo `middleware.ts` se llama `proxy.ts`.
// next-intl todavía exporta su helper desde `next-intl/middleware`, pero
// internamente es compatible con la nueva convención.
export default createMiddleware(routing)

export const config = {
  // Excluye rutas de sistema, API y archivos estáticos.
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
