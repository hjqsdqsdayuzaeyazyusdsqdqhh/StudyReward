import Link from "next/link"
import { opportunities } from "@/lib/placeholders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

interface RelatedStudiesProps {
  currentId?: string
  categorySlug?: string
  stateSlug?: string
  type?: string
  providerSlug?: string
  limit?: number
  title?: string
}

export function RelatedStudies({
  currentId,
  categorySlug,
  stateSlug,
  type,
  providerSlug,
  limit = 3,
  title = "Related Studies",
}: RelatedStudiesProps) {
  const matched = opportunities.filter((o) => {
    if (currentId && String(o.id) === currentId) return false
    if (categorySlug && o.categorySlug === categorySlug) return true
    if (stateSlug && o.stateSlug === stateSlug) return true
    if (type && o.type === type) return true
    if (providerSlug && o.providerSlug === providerSlug) return true
    return false
  })

  const items = matched.slice(0, limit)
  if (items.length === 0) return null

  return (
    <section>
      <h2 className="mb-6 text-xl font-bold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((study) => (
          <Card key={study.id} className="transition-colors hover:border-primary/50">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm">
                  <Link href={study.url ?? `/studies/${study.slug}`} className="line-clamp-2 hover:underline">
                    {study.title}
                  </Link>
                </CardTitle>
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {study.compensation}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {study.description}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {study.isRemote ? "Remote" : `${study.city}, ${study.state}`}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
