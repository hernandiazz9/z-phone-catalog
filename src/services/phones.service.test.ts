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

  it('listPhones sends the x-api-key header and forwards search/limit/offset', async () => {
    const body = [{ id: 'ABC', brand: 'Acme', name: 'X', basePrice: 1, imageUrl: 'u' }]
    fetchMock.mockResolvedValueOnce(okResponse(body))

    const { listPhones } = await import('./phones.service')
    const result = await listPhones({ search: 'galaxy', limit: 20, offset: 0 })

    expect(result).toEqual(body)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [url, init] = fetchMock.mock.calls[0]
    const parsed = new URL(String(url))
    expect(parsed.origin + parsed.pathname).toBe('https://api.example.test/products')
    expect(parsed.searchParams.get('search')).toBe('galaxy')
    expect(parsed.searchParams.get('limit')).toBe('20')
    expect(parsed.searchParams.get('offset')).toBe('0')
    expect(init?.headers).toMatchObject({ 'x-api-key': 'test-key-123' })
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
