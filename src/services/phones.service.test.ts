import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// server-only refuses to be imported from tests by default; stub it so the
// service module loads under Vitest. In real code it still enforces the
// server/client boundary at build time.
vi.mock('server-only', () => ({}))

describe('phones.service', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    vi.stubEnv('PHONES_API_BASE_URL', 'https://api.example.test')
    vi.stubEnv('PHONES_API_KEY', 'test-key-123')
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockReset()
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  function okResponse<T>(body: T): Response {
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  it('listPhones sends the x-api-key header and forwards the search param', async () => {
    const body = [{ id: 'ABC', brand: 'Acme', name: 'X', basePrice: 1, imageUrl: 'u' }]
    fetchMock.mockResolvedValueOnce(okResponse(body))

    const { listPhones } = await import('./phones.service')
    const result = await listPhones({ search: 'galaxy' })

    expect(result).toEqual(body)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [url, init] = fetchMock.mock.calls[0]
    const parsed = new URL(String(url))
    expect(parsed.origin + parsed.pathname).toBe('https://api.example.test/products')
    expect(parsed.searchParams.get('search')).toBe('galaxy')
    // Pagination is applied locally, never forwarded to the upstream API.
    expect(parsed.searchParams.has('limit')).toBe(false)
    expect(parsed.searchParams.has('offset')).toBe(false)
    expect(init?.headers).toMatchObject({ 'x-api-key': 'test-key-123' })
  })

  it('listPhones dedupes by id and caps the result to the limit argument', async () => {
    const body = [
      { id: 'A', brand: 'X', name: 'A', basePrice: 1, imageUrl: 'u' },
      { id: 'B', brand: 'X', name: 'B', basePrice: 2, imageUrl: 'u' },
      { id: 'A', brand: 'X', name: 'A-dup', basePrice: 1, imageUrl: 'u' },
      { id: 'C', brand: 'X', name: 'C', basePrice: 3, imageUrl: 'u' },
      { id: 'D', brand: 'X', name: 'D', basePrice: 4, imageUrl: 'u' },
    ]
    fetchMock.mockResolvedValueOnce(okResponse(body))

    const { listPhones } = await import('./phones.service')
    const result = await listPhones({ limit: 3 })

    expect(result.map((item) => item.id)).toEqual(['A', 'B', 'C'])
  })

  it('listPhones defaults the limit to 20', async () => {
    const body = Array.from({ length: 30 }, (_, i) => ({
      id: `ID-${i}`,
      brand: 'X',
      name: `P${i}`,
      basePrice: i,
      imageUrl: 'u',
    }))
    fetchMock.mockResolvedValueOnce(okResponse(body))

    const { listPhones } = await import('./phones.service')
    const result = await listPhones()

    expect(result).toHaveLength(20)
    expect(result[0].id).toBe('ID-0')
    expect(result[19].id).toBe('ID-19')
  })

  it('listPhones uses no-store when searching and revalidate otherwise', async () => {
    // Build a fresh Response per call — bodies are single-use streams.
    fetchMock.mockImplementation(() => Promise.resolve(okResponse([])))
    const { listPhones } = await import('./phones.service')

    await listPhones({ search: 'iphone' })
    expect(fetchMock.mock.calls[0][1]?.cache).toBe('no-store')

    fetchMock.mockClear()
    await listPhones()
    expect(fetchMock.mock.calls[0][1]?.next).toEqual({ revalidate: 3600 })
  })

  it('getPhoneById calls /products/:id and returns the detail payload', async () => {
    const detail = {
      id: 'SMG-S24U',
      brand: 'Samsung',
      name: 'Galaxy S24 Ultra',
      description: '...',
      basePrice: 1329,
      rating: 4.6,
      specs: {
        screen: '',
        resolution: '',
        processor: '',
        mainCamera: '',
        selfieCamera: '',
        battery: '',
        os: '',
        screenRefreshRate: '',
      },
      colorOptions: [],
      storageOptions: [],
      similarProducts: [],
    }
    fetchMock.mockResolvedValueOnce(okResponse(detail))

    const { getPhoneById } = await import('./phones.service')
    const result = await getPhoneById('SMG-S24U')

    expect(result).toEqual(detail)
    const [url] = fetchMock.mock.calls[0]
    expect(String(url)).toBe('https://api.example.test/products/SMG-S24U')
  })

  it('throws a readable error when the API replies non-ok', async () => {
    fetchMock.mockResolvedValueOnce(new Response('nope', { status: 500, statusText: 'Boom' }))
    const { listPhones } = await import('./phones.service')

    await expect(listPhones()).rejects.toThrow(/500 Boom/)
  })

  it('throws when PHONES_API_KEY is missing', async () => {
    vi.stubEnv('PHONES_API_KEY', '')
    const { listPhones } = await import('./phones.service')

    await expect(listPhones()).rejects.toThrow(/PHONES_API_KEY/)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
