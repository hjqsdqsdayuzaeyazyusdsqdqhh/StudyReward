import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-5 w-32" />
      <Skeleton className="mb-4 h-10 w-64" />
      <Skeleton className="mb-8 h-5 w-80" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="rounded-lg border bg-card">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="mb-1 h-5 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Skeleton className="mb-3 h-4 w-full" />
              <Skeleton className="mb-1 h-4 w-4/5" />
              <div className="mt-3 flex gap-1.5">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
