import Link from "next/link"
import { guides } from "@/lib/placeholders"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ArrowUpRight } from "lucide-react"

export function LatestGuides() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="guides-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 id="guides-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
              Latest Guides
            </h2>
            <p className="mt-2 text-muted-foreground">
              Expert advice on finding and participating in paid research
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/guides">View All Guides</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Card key={guide.id} className="flex flex-col">
              <CardHeader>
                <Badge variant="secondary" className="w-fit">{guide.category}</Badge>
                <CardTitle className="text-base mt-2">
                  <Link href={`/guides/${guide.slug}`} className="hover:underline">
                    {guide.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {guide.description}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {guide.readTime} read
                </span>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href={`/guides/${guide.slug}`}>
                    Read <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
