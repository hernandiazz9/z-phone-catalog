# Zara Challenge — Catálogo de móviles

Tienda online sencilla de teléfonos: listado con buscador en tiempo real, ficha de detalle con selector de color y almacenamiento, y carrito persistente.

**Demo:** https://z-phone-catalog.vercel.app · **Repo:** https://github.com/hernandiazz9/z-phone-catalog

Implementa los tres bonus técnicos que sugiere el PDF: SSR con Next.js, variables CSS y despliegue en Vercel.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript 5
- next-intl para i18n (español por defecto, inglés como segundo idioma)
- Tailwind v4 con tokens declarados en `@theme`
- Vitest + Testing Library para los tests
- ESLint + Prettier + Husky + lint-staged

## Cómo correr el proyecto

### Requisitos

Node 20+ y npm. No hace falta nada más.

### Variables de entorno

Copia el ejemplo y rellena los dos valores:

```bash
cp .env.local.example .env.local
```

| Variable              | Para qué sirve                                         |
| --------------------- | ------------------------------------------------------ |
| `PHONES_API_BASE_URL` | URL base de la API del challenge.                      |
| `PHONES_API_KEY`      | Cabecera `x-api-key` que la API exige en cada request. |

Las dos viven solo en el servidor — nunca llegan al navegador.

### Modo desarrollo

```bash
npm install
npm run dev
```

http://localhost:3000

### Modo producción

```bash
npm run build
npm run start
```

`next build` minimiza y concatena los assets, que es lo que pide el PDF para el modo producción.

## Despliegue

La app está publicada en Vercel: https://z-phone-catalog.vercel.app. Cada `git push` a `main` redespliega automáticamente.

Para hacer tu propio deploy: conectá el repo en https://vercel.com/new y añadí `PHONES_API_BASE_URL` y `PHONES_API_KEY` como variables de entorno. Vercel detecta Next.js solo, no hace falta configuración adicional.

## Arquitectura — decisiones que tomé

- **Proxy de la API en route handlers** ([src/app/api/phones/](src/app/api/phones/)). La API del challenge exige una `x-api-key`. En vez de exponerla en el cliente, las llamadas pasan por route handlers de Next que la añaden server-side. El listado y la ficha consumen el servicio directamente desde React Server Components; el route handler solo se usa cuando el cliente necesita un detalle (por ejemplo, el botón de "añadir rápido" desde una tarjeta del listado).

- **React Context + `localStorage` para el carrito**. Es lo que pide el PDF y encaja con el caso: el carrito es estado global y tiene que persistir entre recargas. La hidratación desde `localStorage` ocurre tras el mount con un flag `isHydrated`, así el render del servidor y el del cliente coinciden y no hay warning de mismatch.

- **SSR en listado y detalle**. El primer render llega con datos. El cliente solo hidrata. El buscador actualiza la URL y deja que Next vuelva a renderizar en servidor — el filtrado lo hace la propia API del challenge, como dice el PDF.

- **i18n con next-intl** bajo el segmento `[locale]`. No es requisito del PDF, pero dejé `/es` y `/en` para que el demo se vea más completo. Las strings viven en [messages/es.json](messages/es.json) y [messages/en.json](messages/en.json).

- **Tokens de diseño en variables CSS** ([src/app/globals.css](src/app/globals.css), bloque `@theme`). Colores, breakpoints, tipografía y animaciones viven todos ahí. Es el tercer bonus del PDF y la única fuente de verdad de la paleta.

## Estructura

```
src/
├── app/
│   ├── [locale]/              listado, /phone/[id], /cart
│   └── api/phones/[id]/       proxy server-side a la API externa
├── components/                cart, phone-card, phone-detail, search-bar, header, ...
├── context/                   carrito (Context + provider)
├── services/                  cliente HTTP del lado servidor
├── i18n/                      configuración de next-intl
└── proxy.ts                   middleware de next-intl (renombrado en Next 16)

messages/
├── es.json
└── en.json
```

Cada componente vive en su propia carpeta (`kebab-case/index.tsx`) con su test al lado como `index.test.tsx`. Las convenciones completas del proyecto están en [.claude/claude.md](.claude/claude.md).

## Tests

```bash
npm run test           # vitest run
npm run test:watch     # modo watch
```

16 archivos / 76 casos cubren el contexto del carrito, el servicio HTTP, los selectores de color y almacenamiento, el botón de añadir al carrito (incluida su lógica de habilitar/deshabilitar), el stepper de cantidad, el buscador con su debounce, el quick-add desde la tarjeta, el modal de variantes, el toast de feedback, el indicador del carrito en el header y el switch de idiomas.

## Calidad

```bash
npm run typecheck
npm run lint
npm run format:check
```

Husky + lint-staged corren ESLint y Prettier sobre los archivos staged en cada commit. La consola del navegador queda limpia tanto en dev como tras `next build`.

## Qué dejé fuera

- **Paginación**: la API del challenge devuelve los 20 móviles fijos por especificación, así que no hace falta.
- **Persistencia del idioma**: next-intl detecta el locale del path. El segmento `[locale]` ya hace ese trabajo, no guardo preferencia aparte.
- **Tests E2E (Playwright/Cypress)**: con la batería de Vitest + RTL ya cubro la lógica relevante; un E2E suite añadiría mantenimiento que para este scope no compensa.
