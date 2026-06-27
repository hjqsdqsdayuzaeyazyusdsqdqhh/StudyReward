import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-5 w-32" />
      <Skeleton className="mb-4 h-10 w-64" />
      <Skeleton className="mb-8 h-5 w-80" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="space-y-2">
                <Skeleton className="mx-auto h-5 w-24" />
                <Skeleton className="mx-auto h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
