import { cn } from "@/lib/utils"

interface SectionTitleProps {
  title: string
  description?: string
  className?: string
  align?: "left" | "center"
  as?: "h1" | "h2" | "h3"
}

export function SectionTitle({
  title,
  description,
  className,
  align = "left",
  as: Tag = "h1",
}: SectionTitleProps) {
  return (
    <div className={cn("mb-8", align === "center" && "text-center", className)}>
      <Tag className="text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </Tag>
      {description && (
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}
