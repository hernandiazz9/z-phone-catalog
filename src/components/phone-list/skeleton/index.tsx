const SKELETON_COUNT = 20

const SHIMMER =
  'from-surface via-border to-surface animate-shimmer bg-gradient-to-r bg-[length:200%_100%]'

export function PhoneListSkeleton() {
  return (
    <section className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <div className={`h-3 w-24 ${SHIMMER}`} />
      <ul className="tablet:grid-cols-2 desktop:grid-cols-4 wide:grid-cols-5 grid grid-cols-1">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <li
            key={index}
            className="bg-background border-border flex aspect-square flex-col gap-6 border-r border-b p-4"
          >
            <div className={`min-h-0 flex-1 ${SHIMMER}`} />
            <div className="flex items-end gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className={`h-2 w-12 ${SHIMMER}`} />
                <div className={`h-3 w-24 ${SHIMMER}`} />
              </div>
              <div className={`h-3 w-16 shrink-0 ${SHIMMER}`} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
