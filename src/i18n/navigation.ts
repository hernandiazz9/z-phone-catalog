import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// Wrappers de navegación con conciencia de locale.
// Úsalos en vez de los equivalentes de `next/link` / `next/navigation`
// cuando quieras que los enlaces respeten el idioma activo.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
