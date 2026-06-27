import Link from "next/link"
import { categories, studyTypes } from "@/lib/placeholders"
import { Badge } from "@/components/ui/badge"

interface TrendingTopicsProps {
  limit?: number
  title?: string
}

export function TrendingTopics({
  limit = 6,
  title = "Trending Topics",
}: TrendingTopicsProps) {
  const sorted = [...categories].sort((a, b) => b.count - a.count)
  const topCategories = sorted.slice(0, limit)

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {topCategories.map((cat) => (
          <Link key={cat.slug} href={`/categories/${cat.slug}`}>
            <Badge
              variant="secondary"
              className="px-3 py-1.5 text-sm transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
            >
              {cat.name}
              <span className="ml-1.5 text-xs opacity-70">
                {cat.count.toLocaleString()}
              </span>
            </Badge>
          </Link>
        ))}
        {studyTypes.map((t) => (
          <Link key={t.id} href={`/${t.slug}`}>
            <Badge
              variant="outline"
              className="px-3 py-1.5 text-sm transition-colors hover:bg-accent cursor-pointer"
            >
              {t.name}
            </Badge>
          </Link>
        ))}
      </div>
    </section>
  )
}
