import Link from "next/link"
import type { StateData } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface StateCardProps {
  state: StateData
}

export function StateCard({ state }: StateCardProps) {
  return (
    <Link href={`/states/${state.slug}`} className="group">
      <Card className="h-full transition-colors hover:border-primary/50">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              {state.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {state.count.toLocaleString()} studies
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
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
