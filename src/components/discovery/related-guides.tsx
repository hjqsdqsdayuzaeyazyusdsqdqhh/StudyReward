import Link from "next/link"
import { guides } from "@/lib/placeholders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface RelatedGuidesProps {
  currentSlug?: string
  category?: string
  limit?: number
  title?: string
}

export function RelatedGuides({
  currentSlug,
  category,
  limit = 3,
  title = "Related Guides",
}: RelatedGuidesProps) {
  const items = guides
    .filter((g) => {
      if (currentSlug && g.slug === currentSlug) return false
      if (category && g.category === category) return true
      return false
    })
    .slice(0, limit)

  if (items.length === 0) return null

  return (
    <section>
      <h2 className="mb-6 text-xl font-bold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((guide) => (
          <Card key={guide.slug} className="transition-colors hover:border-primary/50">
            <CardHeader>
              <Badge variant="secondary" className="w-fit text-xs">
                {guide.category}
              </Badge>
              <CardTitle className="text-sm">
                <Link
                  href={`/guides/${guide.slug}`}
                  className="line-clamp-2 hover:underline"
                >
                  {guide.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {guide.description}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {guide.readTime} read
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
