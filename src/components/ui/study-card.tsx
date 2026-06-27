import Link from "next/link"
import { MapPin, DollarSign, Clock, Building2 } from "lucide-react"
import type { StudyOpportunity } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface StudyCardProps {
  study: StudyOpportunity
}

const statusConfig = {
  active: { variant: "success" as const, label: "Active" },
  upcoming: { variant: "warning" as const, label: "Upcoming" },
  filled: { variant: "secondary" as const, label: "Filled" },
} as const

export function StudyCard({ study }: StudyCardProps) {
  const { variant, label } = statusConfig[study.status]

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base">
              <Link href={study.url ?? `/studies/${study.slug}`} className="line-clamp-2 hover:underline">
                {study.title}
              </Link>
            </CardTitle>
            <Badge variant="secondary" className="mt-1.5">
              {study.category}
            </Badge>
          </div>
          <Badge variant={variant} className="shrink-0">
            {label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {study.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {study.isRemote ? "Remote" : `${study.city}, ${study.state}`}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5 shrink-0" />
            {study.compensation}
          </span>
          <span className="flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            {study.provider}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {study.postedDate}
          </span>
        </div>
      </CardContent>
      <div className="px-6 pb-4">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={study.url ?? `/studies/${study.slug}`}>View Details</Link>
        </Button>
      </div>
    </Card>
  )
}

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
