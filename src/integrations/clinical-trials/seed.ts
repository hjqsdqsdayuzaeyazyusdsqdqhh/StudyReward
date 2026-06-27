import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import { StateRepository } from "@/lib/repositories/state"
import { CityRepository } from "@/lib/repositories/city"
import { CategoryRepository } from "@/lib/repositories/category"
import { CompanyRepository } from "@/lib/repositories/company"
import { StudyTypeRepository } from "@/lib/repositories/study-type"
import { OpportunityRepository } from "@/lib/repositories/opportunity"
import { StateService } from "@/lib/services/state"
import { CityService } from "@/lib/services/city"
import { CategoryService } from "@/lib/services/category"
import { CompanyService } from "@/lib/services/company"
import { StudyTypeService } from "@/lib/services/study-type"
import { ClinicalTrialsApiClient } from "./client"
import { ClinicalTrialsNormalizer } from "./normalizer"
import { ClinicalTrialsTransformer } from "./transformer"
import { ClinicalTrialsImportService } from "./import-service"
import { IntegrationLogger } from "../logging"

async function main() {
  console.log("ClinicalTrials.gov Import Tool")
  console.log("==============================")

  const connectionString = `${process.env.DATABASE_URL}`
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    const logger = new IntegrationLogger(100000, true)

    const stateRepo = new StateRepository(prisma)
    const cityRepo = new CityRepository(prisma)
    const categoryRepo = new CategoryRepository(prisma)
    const companyRepo = new CompanyRepository(prisma)
    const studyTypeRepo = new StudyTypeRepository(prisma)
    const opportunityRepo = new OpportunityRepository(prisma)

    const stateService = new StateService(stateRepo)
    const cityService = new CityService(cityRepo)
    const categoryService = new CategoryService(categoryRepo)
    const companyService = new CompanyService(companyRepo)
    const studyTypeService = new StudyTypeService(studyTypeRepo)

    const client = new ClinicalTrialsApiClient()
    const normalizer = new ClinicalTrialsNormalizer()
    const transformer = new ClinicalTrialsTransformer(
      stateService,
      cityService,
      categoryService,
      companyService,
      studyTypeService,
    )
    const importService = new ClinicalTrialsImportService(
      client,
      normalizer,
      transformer,
      opportunityRepo,
      logger,
    )

    const mode = process.argv[2] ?? "single"

    if (mode === "all") {
      console.log("Starting full import...")
      console.log("WARNING: This may make thousands of API calls.\n")

      const stats = await importService.importAll({
        status: "RECRUITING,NOT_YET_RECRUITING,ACTIVE_NOT_RECRUITING,ENROLLING_BY_INVITATION",
        country: "US",
      })

      console.log("\nImport complete!")
      console.log(`  Pages:       ${stats.totalPages}`)
      console.log(`  Fetched:     ${stats.totalFetched}`)
      console.log(`  Created:     ${stats.totalCreated}`)
      console.log(`  Updated:     ${stats.totalUpdated}`)
      console.log(`  Skipped:     ${stats.totalSkipped}`)
      console.log(`  Failed:      ${stats.totalFailed}`)
      if (stats.errors.length > 0) {
        console.log(`  Errors:      ${stats.errors.length}`)
        for (const err of stats.errors.slice(0, 10)) {
          console.log(`    - ${err}`)
        }
      }
    } else {
      console.log("Starting single-page import (add 'all' argument for full import)...\n")

      const stats = await importService.importSinglePage({
        status: "RECRUITING,NOT_YET_RECRUITING,ACTIVE_NOT_RECRUITING,ENROLLING_BY_INVITATION",
        country: "US",
      })

      console.log("\nImport complete!")
      console.log(`  Fetched:     ${stats.totalFetched}`)
      console.log(`  Created:     ${stats.totalCreated}`)
      console.log(`  Updated:     ${stats.totalUpdated}`)
      console.log(`  Skipped:     ${stats.totalSkipped}`)
      console.log(`  Failed:      ${stats.totalFailed}`)
      if (stats.errors.length > 0) {
        for (const err of stats.errors.slice(0, 5)) {
          console.log(`    - ${err}`)
        }
      }
    }
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
