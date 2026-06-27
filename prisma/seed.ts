import "dotenv/config"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient, type CompensationType, type OpportunityStatus } from "@prisma/client"
import * as fs from "node:fs"
import * as path from "node:path"

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

function loadJson<T>(file: string): T[] {
  const p = path.resolve("src/data", file)
  return JSON.parse(fs.readFileSync(p, "utf-8")) as T[]
}

type StateJson = { name: string; abbreviation: string; slug: string; count: number }
type CityJson = { name: string; slug: string; state: string; stateSlug: string; count: number }
type CategoryJson = { id: string; name: string; slug: string; icon: string; description: string; count: number }
type CompanyJson = { id: string; name: string; slug: string; description: string; studyCount: number; types: string[]; locations: string[] }
type StudyTypeJson = { id: string; name: string; slug: string }
type OpportunityStatusJson = "active" | "upcoming" | "filled"
type OpportunityJson = {
  id: string; title: string; slug: string; category: string; categorySlug: string
  state: string; stateSlug: string; city: string; citySlug: string
  compensation: string; compensationRange: { min: number; max: number }
  description: string; provider: string; providerSlug: string
  type: string; status: OpportunityStatusJson; featured: boolean; isRemote: boolean
  postedDate: string; url: string
}
type GuideJson = { id: string; title: string; slug: string; description: string; category: string; readTime: string; date: string; author: string }
type FaqJson = { id: string; question: string; answer: string; category: string }

async function main() {
  console.log("Seeding database...")

  // Load all JSON data
  const statesData = loadJson<StateJson>("states.json")
  const citiesData = loadJson<CityJson>("cities.json")
  const categoriesData = loadJson<CategoryJson>("categories.json")
  const companiesData = loadJson<CompanyJson>("companies.json")
  const studyTypesData = loadJson<StudyTypeJson>("studyTypes.json")
  const opportunitiesData = loadJson<OpportunityJson>("opportunities.json")
  const guidesData = loadJson<GuideJson>("guides.json")
  const faqData = loadJson<FaqJson>("faq.json")

  // Clean existing data
  await prisma.opportunityTag.deleteMany()
  await prisma.fAQ.deleteMany()
  await prisma.guide.deleteMany()
  await prisma.opportunity.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.studyType.deleteMany()
  await prisma.city.deleteMany()
  await prisma.state.deleteMany()
  await prisma.company.deleteMany()
  await prisma.category.deleteMany()

  // Insert states
  const stateMap = new Map<string, string>()
  for (const s of statesData) {
    const created = await prisma.state.create({
      data: { name: s.name, slug: s.slug, abbreviation: s.abbreviation },
    })
    stateMap.set(s.slug, created.id)
  }
  console.log(`  ✓ ${statesData.length} states`)

  // Insert cities
  const cityMap = new Map<string, string>()
  for (const c of citiesData) {
    const stateId = stateMap.get(c.stateSlug)
    if (!stateId) {
      console.warn(`  ⚠ State not found for city ${c.name} (${c.stateSlug})`)
      continue
    }
    const created = await prisma.city.create({
      data: { name: c.name, slug: c.slug, stateId },
    })
    cityMap.set(c.slug, created.id)
  }
  console.log(`  ✓ ${citiesData.length} cities`)

  // Insert categories
  const categoryNameMap = new Map<string, string>()
  const categorySlugMap = new Map<string, string>()
  for (const c of categoriesData) {
    const created = await prisma.category.create({
      data: {
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        description: c.description,
      },
    })
    categoryNameMap.set(c.name, created.id)
    categorySlugMap.set(c.slug, created.id)
  }
  console.log(`  ✓ ${categoriesData.length} categories`)

  // Insert companies
  const companyMap = new Map<string, string>()
  for (const c of companiesData) {
    const created = await prisma.company.create({
      data: {
        name: c.name,
        slug: c.slug,
        description: c.description,
      },
    })
    companyMap.set(c.slug, created.id)
  }
  console.log(`  ✓ ${companiesData.length} companies`)

  // Insert study types
  const studyTypeMap = new Map<string, string>()
  for (const st of studyTypesData) {
    const created = await prisma.studyType.create({
      data: { name: st.name, slug: st.slug },
    })
    // Map both slug and id so lookups by either work
    studyTypeMap.set(st.slug, created.id)
    studyTypeMap.set(st.id, created.id)
  }
  console.log(`  ✓ ${studyTypesData.length} study types`)

  // Insert tags from study type slugs
  const tagMap = new Map<string, string>()
  const uniqueTags = new Set(opportunitiesData.map((o) => o.type))
  for (const slug of uniqueTags) {
    const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    const created = await prisma.tag.create({
      data: { name, slug },
    })
    tagMap.set(slug, created.id)
  }
  console.log(`  ✓ ${uniqueTags.size} tags`)

  // Insert opportunities
  let oppCount = 0
  for (const o of opportunitiesData) {
    const categoryId = categorySlugMap.get(o.categorySlug)
    const stateId = stateMap.get(o.stateSlug)
    const cityId = cityMap.get(o.citySlug)
    const companyId = companyMap.get(o.providerSlug)
    const studyTypeId = studyTypeMap.get(o.type)

    if (!categoryId || !stateId || !cityId || !companyId || !studyTypeId) {
      console.warn(`  ⚠ Skipping opportunity "${o.title}" — missing relation`)
      continue
    }

    const statusMap: Record<OpportunityStatusJson, OpportunityStatus> = {
      active: "Active",
      upcoming: "Upcoming",
      filled: "Filled",
    }

    const compensationType: CompensationType =
      o.compensationRange.min !== o.compensationRange.max ? "Range" : "Fixed"

    await prisma.opportunity.create({
      data: {
        title: o.title,
        slug: o.slug,
        shortDescription: o.description,
        companyId,
        categoryId,
        studyTypeId,
        stateId,
        cityId,
        compensation: o.compensation,
        compensationType,
        online: o.isRemote,
        featured: o.featured,
        status: statusMap[o.status],
        postedDate: new Date(o.postedDate),
      },
    })
    oppCount++
  }
  console.log(`  ✓ ${oppCount} opportunities`)

  // Insert opportunity tags
  const allOpps = await prisma.opportunity.findMany({ select: { id: true, slug: true } })
  const oppSlugMap = new Map(allOpps.map((o) => [o.slug, o.id]))
  let otCount = 0
  for (const o of opportunitiesData) {
    const oppId = oppSlugMap.get(o.slug)
    const tagId = tagMap.get(o.type)
    if (!oppId || !tagId) continue
    await prisma.opportunityTag.create({
      data: { opportunityId: oppId, tagId },
    })
    otCount++
  }
  console.log(`  ✓ ${otCount} opportunity tags`)

  // Insert guides
  let guideCount = 0
  for (const g of guidesData) {
    const categoryId = categoryNameMap.get(g.category)
    if (!categoryId) {
      console.warn(`  ⚠ Category "${g.category}" not found for guide "${g.title}"`)
      continue
    }
    await prisma.guide.create({
      data: {
        title: g.title,
        slug: g.slug,
        excerpt: g.description,
        categoryId,
      },
    })
    guideCount++
  }
  console.log(`  ✓ ${guideCount} guides`)

  // Insert FAQs
  for (const f of faqData) {
    await prisma.fAQ.create({
      data: { question: f.question, answer: f.answer },
    })
  }
  console.log(`  ✓ ${faqData.length} FAQs`)

  console.log("\nSeeding complete!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error("Seed error:", e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })
