import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import enMessages from '../../../messages/en.json'
import { SearchBar } from '.'

const replaceMock = vi.fn()
let searchParamsString = ''

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key: string) => new URLSearchParams(searchParamsString).get(key),
    toString: () => searchParamsString,
  }),
}))

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => '/',
}))

function renderBar() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <SearchBar />
    </NextIntlClientProvider>,
  )
}

describe('search-bar', () => {
  beforeEach(() => {
    replaceMock.mockClear()
    searchParamsString = ''
  })

  it('debounces typing and updates the URL with the trimmed query', async () => {
    const user = userEvent.setup()
    renderBar()

    const input = screen.getByRole('searchbox')
    await user.type(input, 'iphone')

    expect(replaceMock).not.toHaveBeenCalled()
    await waitFor(
      () => {
        expect(replaceMock).toHaveBeenCalledWith('/?search=iphone', { scroll: false })
      },
      { timeout: 2000 },
    )
  })

  it('resets the debounce on every keystroke and only fires once for the final value', async () => {
    const user = userEvent.setup()
    renderBar()

    const input = screen.getByRole('searchbox')
    await user.type(input, 'abc')
    await user.keyboard('{Backspace}{Backspace}{Backspace}')
    await user.type(input, 'xyz')

    await waitFor(
      () => {
        expect(replaceMock).toHaveBeenCalledWith('/?search=xyz', { scroll: false })
      },
      { timeout: 2000 },
    )
    expect(replaceMock).toHaveBeenCalledTimes(1)
  })

  it('hydrates initial value from URL searchParams', () => {
    searchParamsString = 'search=pixel'
    renderBar()
    const input = screen.getByRole('searchbox') as HTMLInputElement
    expect(input.value).toBe('pixel')
  })
})
