import Link from "next/link"
import type { Category } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import {
  FlaskConical,
  Users,
  Package,
  HeartPulse,
  Scale,
  ClipboardList,
  Brain,
  Apple,
} from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  FlaskConical: <FlaskConical className="h-8 w-8" />,
  Users: <Users className="h-8 w-8" />,
  Package: <Package className="h-8 w-8" />,
  HeartPulse: <HeartPulse className="h-8 w-8" />,
  Scale: <Scale className="h-8 w-8" />,
  ClipboardList: <ClipboardList className="h-8 w-8" />,
  Brain: <Brain className="h-8 w-8" />,
  Apple: <Apple className="h-8 w-8" />,
}

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="group">
      <Card className="h-full transition-colors hover:border-primary/50">
        <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
          <div className="text-primary" aria-hidden="true">
            {iconMap[category.icon]}
          </div>
          <div>
            <h3 className="font-semibold">{category.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {category.count.toLocaleString()} studies
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
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
