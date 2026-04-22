import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { PhoneList } from '@/components/phone-list'
import { SearchBar } from '@/components/search-bar'
import { PhoneListSkeleton } from '@/components/phone-list/skeleton'

type HomePageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ search?: string }>
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const { search } = await searchParams

  return (
    <main className="max-w-page mx-auto flex w-full flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-10 2xl:px-25">
      <SearchBar />
      <Suspense key={search ?? ''} fallback={<PhoneListSkeleton />}>
        <PhoneList search={search} />
      </Suspense>
    </main>
  )
}
