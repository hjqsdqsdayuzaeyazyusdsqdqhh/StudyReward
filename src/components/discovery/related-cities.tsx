import Link from "next/link"
import { cities } from "@/lib/placeholders"
import { cn } from "@/lib/utils"

interface RelatedCitiesProps {
  currentSlug?: string
  stateSlug?: string
  limit?: number
  title?: string
}

export function RelatedCities({
  currentSlug,
  stateSlug,
  limit = 8,
  title = "Cities",
}: RelatedCitiesProps) {
  if (!stateSlug) return null

  const items = cities
    .filter((c) => {
      if (currentSlug && c.slug === currentSlug) return false
      return c.stateSlug === stateSlug
    })
    .slice(0, limit)

  if (items.length === 0) return null

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {items.map((c) => (
          <Link
            key={c.slug}
            href={`/cities/${c.slug}`}
            className={cn(
              "rounded-lg border bg-card px-3 py-2.5 text-center transition-colors hover:border-primary/50"
            )}
          >
            <span className="text-sm font-medium">{c.name}</span>
            <p className="text-xs text-muted-foreground">
              {c.count.toLocaleString()} studies
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
