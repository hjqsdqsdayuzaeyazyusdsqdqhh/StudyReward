import Link from "next/link"
import { cn } from "@/lib/utils"

export interface SidebarSection {
  id: string
  label: string
  icon?: React.ReactNode
  items: {
    label: string
    href: string
    count?: number
    metadata?: string
  }[]
  footer?: {
    label: string
    href: string
  }
}

interface SidebarProps {
  sections: SidebarSection[]
  className?: string
}

export function Sidebar({ sections, className }: SidebarProps) {
  return (
    <aside
      className={cn("w-full shrink-0 lg:w-64", className)}
      aria-label="Sidebar navigation"
    >
      <div className="space-y-6">
        {sections.map((section) => (
          <nav key={section.id} aria-labelledby={`sidebar-${section.id}`}>
            <h3
              id={`sidebar-${section.id}`}
              className="mb-3 flex items-center gap-2 text-sm font-semibold"
            >
              {section.icon && (
                <span className="text-primary" aria-hidden="true">
                  {section.icon}
                </span>
              )}
              {section.label}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="truncate">{item.label}</span>
                    {item.count !== undefined && (
                      <span className="ml-2 shrink-0 text-xs">
                        {item.count}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            {section.footer && (
              <Link
                href={section.footer.href}
                className="mt-1 block rounded-md px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {section.footer.label}
              </Link>
            )}
          </nav>
        ))}
      </div>
    </aside>
  )
}
