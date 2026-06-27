import Link from "next/link"
import type { Guide } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ArrowUpRight } from "lucide-react"

function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Badge variant="secondary" className="w-fit">{guide.category}</Badge>
        <CardTitle className="text-base mt-2">
          <Link href={`/guides/${guide.slug}`} className="hover:underline">
            {guide.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-2 text-sm text-muted-foreground">{guide.description}</p>
      </CardContent>
      <div className="flex items-center justify-between px-6 pb-4">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {guide.readTime} read
        </span>
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <Link href={`/guides/${guide.slug}`}>
            Read <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </Card>
  )
}

function GuideCardSkeleton() {
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

export { GuideCard, GuideCardSkeleton }
