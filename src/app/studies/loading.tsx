import { Skeleton } from "@/components/ui/skeleton"
import { BreadcrumbsSkeleton } from "@/components/ui/breadcrumbs"

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <BreadcrumbsSkeleton />
      <Skeleton className="mb-8 h-10 w-64" />
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64" aria-label="Loading filters">
          <Skeleton className="mb-6 h-80 w-full rounded-lg" />
        </aside>
        <div className="min-w-0 flex-1">
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="rounded-lg border bg-card">
                <div className="p-6">
                  <Skeleton className="mb-3 h-5 w-3/4" />
                  <Skeleton className="mb-2 h-4 w-1/3" />
                  <Skeleton className="mb-6 h-4 w-full" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="border-t p-4">
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
