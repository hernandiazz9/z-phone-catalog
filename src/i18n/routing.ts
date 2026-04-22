import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // Todos los locales soportados por la aplicación.
  locales: ['es', 'en'],

  // Locale por defecto cuando no hay match.
  defaultLocale: 'es',

  // Estrategia de prefijo: mantenemos el prefijo siempre para rutas claras
  // (/es/..., /en/...) y para que el middleware pueda cambiar de idioma
  // sin sorpresas.
  localePrefix: 'always',
})

export type Locale = (typeof routing.locales)[number]
