const SKELETON_COUNT = 20

export function PhoneListSkeleton() {
  return (
    <section className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <div className="bg-surface h-3 w-24 animate-pulse" />
      <ul className="bg-border grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <li key={index} className="bg-background flex aspect-square flex-col gap-6 p-4">
            <div className="bg-surface min-h-0 flex-1 animate-pulse" />
            <div className="flex items-end gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="bg-surface h-2 w-12 animate-pulse" />
                <div className="bg-surface h-3 w-24 animate-pulse" />
              </div>
              <div className="bg-surface h-3 w-16 shrink-0 animate-pulse" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
