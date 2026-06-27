import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function StudyCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="h-5 w-3/4 animate-pulse rounded bg-primary/10" />
        <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-primary/10" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-4 w-full animate-pulse rounded bg-primary/10" />
        <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-primary/10" />
        <div className="mt-4 flex gap-4">
          <div className="h-4 w-28 animate-pulse rounded bg-primary/10" />
          <div className="h-4 w-20 animate-pulse rounded bg-primary/10" />
          <div className="h-4 w-32 animate-pulse rounded bg-primary/10" />
        </div>
      </CardContent>
      <div className="px-6 pb-4">
        <div className="h-9 w-full animate-pulse rounded-lg bg-primary/10" />
      </div>
    </Card>
  )
}

export function GuideCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="h-5 w-20 animate-pulse rounded bg-primary/10" />
        <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-primary/10" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-4 w-full animate-pulse rounded bg-primary/10" />
        <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-primary/10" />
      </CardContent>
      <div className="flex items-center justify-between px-6 pb-4">
        <div className="h-4 w-20 animate-pulse rounded bg-primary/10" />
        <div className="h-8 w-20 animate-pulse rounded bg-primary/10" />
      </div>
    </Card>
  )
}

export function CategoryCardSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
        <div className="h-8 w-8 animate-pulse rounded bg-primary/10" />
        <div className="space-y-2">
          <div className="mx-auto h-5 w-24 animate-pulse rounded bg-primary/10" />
          <div className="mx-auto h-3 w-16 animate-pulse rounded bg-primary/10" />
        </div>
      </CardContent>
    </Card>
  )
}

export function StateCardSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-primary/10" />
        <div className="min-w-0 flex-1">
          <div className="h-5 w-32 animate-pulse rounded bg-primary/10" />
          <div className="mt-1.5 h-3 w-20 animate-pulse rounded bg-primary/10" />
        </div>
      </CardContent>
    </Card>
  )
}

export function CardGridSkeleton({ count = 6, CardSkeleton = StudyCardSkeleton }: { count?: number; CardSkeleton?: React.ComponentType }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
