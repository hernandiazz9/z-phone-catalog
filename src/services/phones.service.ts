import 'server-only'

import type { ListPhonesArgs, Phone, PhoneListItem } from './phones.types'

// `server-only` makes importing this module from a Client Component fail
// at build time, so PHONES_API_KEY can never leak to the browser bundle.

const DEFAULT_REVALIDATE_SECONDS = 60 * 60

function getApiConfig() {
  const baseUrl = process.env.PHONES_API_BASE_URL
  const apiKey = process.env.PHONES_API_KEY

  if (!baseUrl) {
    throw new Error('Missing PHONES_API_BASE_URL environment variable.')
  }
  if (!apiKey) {
    throw new Error('Missing PHONES_API_KEY environment variable.')
  }

  return { baseUrl: baseUrl.replace(/\/$/, ''), apiKey }
}

type FetchPhonesArgs = {
  path: string
  searchParams?: Record<string, string | number | undefined>
  revalidate?: number | false
}

async function fetchFromApi<T>({
  path,
  searchParams,
  revalidate = DEFAULT_REVALIDATE_SECONDS,
}: FetchPhonesArgs): Promise<T> {
  const { baseUrl, apiKey } = getApiConfig()
  const url = new URL(`${baseUrl}${path}`)
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined || value === '') continue
      url.searchParams.set(key, String(value))
    }
  }

  const response = await fetch(url, {
    headers: { 'x-api-key': apiKey },
    next: revalidate === false ? undefined : { revalidate },
    cache: revalidate === false ? 'no-store' : undefined,
  })

  if (!response.ok) {
    throw new Error(
      `Phones API request failed (${response.status} ${response.statusText}) for ${url.pathname}`,
    )
  }

  return (await response.json()) as T
}

const DEFAULT_LIMIT = 20

export async function listPhones({ search, limit = DEFAULT_LIMIT }: ListPhonesArgs = {}): Promise<
  PhoneListItem[]
> {
  const raw = await fetchFromApi<PhoneListItem[]>({
    path: '/products',
    searchParams: { search },
    // Search results must stay fresh per keystroke; unfiltered lists use ISR.
    revalidate: search ? false : DEFAULT_REVALIDATE_SECONDS,
  })

  // The upstream catalog currently contains duplicate product IDs. Dedupe
  // by id so every consumer gets stable unique keys; slicing locally also
  // protects against the API silently ignoring `limit`.
  const seen = new Set<string>()
  const unique: PhoneListItem[] = []
  for (const item of raw) {
    if (seen.has(item.id)) continue
    seen.add(item.id)
    unique.push(item)
  }
  return unique.slice(0, limit)
}

export async function getPhoneById(id: string): Promise<Phone> {
  if (!id) throw new Error('getPhoneById: id is required')
  return fetchFromApi<Phone>({ path: `/products/${encodeURIComponent(id)}` })
}
