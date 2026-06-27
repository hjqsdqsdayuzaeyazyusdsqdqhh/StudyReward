import type { BreadcrumbItem } from "@/types"

export function generateBreadcrumbs(segments: { label: string; href?: string }[]): BreadcrumbItem[] {
  return [{ label: "Home", href: "/" }, ...segments]
}

export function breadcrumbFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean)
  const crumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }]

  let current = ""
  for (const segment of segments) {
    current += `/${segment}`
    const label = segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
    crumbs.push({ label, href: current })
  }

  return crumbs
}
