import Link from "next/link"
import { categories } from "@/lib/placeholders"
import { Card, CardContent } from "@/components/ui/card"
import { FlaskConical, Users, Package, HeartPulse, Scale, ClipboardList, Brain, Apple } from "lucide-react"

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

export function PopularCategories() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="categories-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="categories-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Browse by Category
          </h2>
          <p className="mt-4 text-muted-foreground">
            Explore paid research opportunities across all major categories
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`} className="group">
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <div className="text-primary">{iconMap[category.icon]}</div>
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{category.count.toLocaleString()} studies</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
