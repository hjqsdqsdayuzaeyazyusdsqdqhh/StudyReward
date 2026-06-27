"use client"

import { useRouter } from "next/navigation"
import { categories, states, companies, opportunities, guides } from "@/lib/placeholders"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { FlaskConical, MapPin, Building2, FileText, Search } from "lucide-react"

interface SearchCommandProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter()

  const handleSelect = (href: string) => {
    onOpenChange(false)
    router.push(href)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search studies, categories, states, companies..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Study Types">
          {[
            { label: "Focus Groups", href: "/focus-groups" },
            { label: "Clinical Trials", href: "/clinical-trials" },
            { label: "Medical Studies", href: "/medical-studies" },
            { label: "Product Testing", href: "/product-testing" },
            { label: "Mock Juries", href: "/mock-jury-studies" },
          ].map((item) => (
            <CommandItem key={item.href} value={item.label} onSelect={() => handleSelect(item.href)}>
              <Search className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Recent Studies">
          {opportunities.slice(0, 5).map((op) => (
            <CommandItem key={op.id} value={op.title} onSelect={() => handleSelect(op.url ?? `/studies/${op.slug}`)}>
              <Search className="mr-2 h-4 w-4" />
              <span className="flex-1 truncate">{op.title}</span>
              <span className="ml-auto text-xs text-muted-foreground">{op.compensation}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Categories">
          {categories.map((cat) => (
            <CommandItem key={cat.id} value={cat.name} onSelect={() => handleSelect(`/categories/${cat.slug}`)}>
              <FlaskConical className="mr-2 h-4 w-4" />
              <span>{cat.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{cat.count} studies</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="States">
          {states.slice(0, 10).map((st) => (
            <CommandItem key={st.abbreviation} value={st.name} onSelect={() => handleSelect(`/states/${st.slug}`)}>
              <MapPin className="mr-2 h-4 w-4" />
              <span>{st.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{st.count} studies</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Companies">
          {companies.slice(0, 5).map((c) => (
            <CommandItem key={c.id} value={c.name} onSelect={() => handleSelect(`/companies/${c.slug}`)}>
              <Building2 className="mr-2 h-4 w-4" />
              <span>{c.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Guides">
          {guides.map((g) => (
            <CommandItem key={g.slug} value={g.title} onSelect={() => handleSelect(`/guides/${g.slug}`)}>
              <FileText className="mr-2 h-4 w-4" />
              <span className="flex-1 truncate">{g.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
