import Link from "next/link"
import { MapPin, DollarSign, Clock, Building2 } from "lucide-react"
import { getFeaturedOpportunities } from "@/lib/placeholders"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const statusVariant: Record<string, "success" | "warning" | "secondary"> = {
  active: "success", upcoming: "warning", filled: "secondary",
}
const statusLabel: Record<string, string> = {
  active: "Active", upcoming: "Upcoming", filled: "Filled",
}

export function FeaturedOpportunities() {
  const featured = getFeaturedOpportunities()

  return (
    <section className="bg-muted/50 py-16 sm:py-24" aria-labelledby="featured-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 id="featured-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
              Featured Opportunities
            </h2>
            <p className="mt-2 text-muted-foreground">
              Top paid research studies available now
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/studies">View All Studies</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((opportunity) => (
            <Card key={opportunity.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">
                      <Link href={opportunity.url ?? `/studies/${opportunity.slug}`} className="hover:underline line-clamp-2">
                        {opportunity.title}
                      </Link>
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1.5">{opportunity.category}</Badge>
                  </div>
                  <Badge variant={statusVariant[opportunity.status]} className="shrink-0">
                    {statusLabel[opportunity.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {opportunity.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {opportunity.isRemote ? "Remote" : `${opportunity.city}, ${opportunity.state}`}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 shrink-0" />
                    {opportunity.compensation}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    {opportunity.provider}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    {opportunity.postedDate}
                  </span>
                </div>
              </CardContent>
              <div className="px-6 pb-4">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={opportunity.url ?? `/studies/${opportunity.slug}`}>View Details</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
