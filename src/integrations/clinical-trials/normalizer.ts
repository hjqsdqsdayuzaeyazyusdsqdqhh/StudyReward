import type { NormalizedClinicalTrial } from "./types"
import type { StudyJson } from "./client"

const STATUS_MAP: Record<string, "Active" | "Upcoming" | "Filled"> = {
  RECRUITING: "Active",
  NOT_YET_RECRUITING: "Upcoming",
  ACTIVE_NOT_RECRUITING: "Active",
  ENROLLING_BY_INVITATION: "Active",
  COMPLETED: "Filled",
  TERMINATED: "Filled",
  WITHDRAWN: "Filled",
  SUSPENDED: "Filled",
}

const DEFAULT_STATUS: "Active" = "Active"

export class ClinicalTrialsNormalizer {
  normalize(raw: StudyJson): NormalizedClinicalTrial | null {
    const protocol = raw.protocolSection
    if (!protocol) return null

    const idModule = protocol.identificationModule
    const statusModule = protocol.statusModule
    const sponsorModule = protocol.sponsorCollaboratorsModule
    const descModule = protocol.descriptionModule
    const conditionsModule = protocol.conditionsModule
    const designModule = protocol.designModule
    const interventionsModule = protocol.armsInterventionsModule
    const eligibilityModule = protocol.eligibilityModule
    const locationsModule = protocol.contactsLocationsModule

    const nctId = idModule?.nctId
    if (!nctId) return null

    const title = idModule?.briefTitle ?? idModule?.officialTitle
    if (!title) return null

    const summary = descModule?.briefSummary
    if (!summary) return null

    const locations = locationsModule?.locations?.filter((l) => l.city && l.state) ?? []
    if (locations.length === 0) return null

    const conditions = conditionsModule?.conditions?.filter(Boolean) ?? []
    if (conditions.length === 0) return null

    const overallStatus = statusModule?.overallStatus
    const status = overallStatus ? (STATUS_MAP[overallStatus] ?? DEFAULT_STATUS) : DEFAULT_STATUS

    const interventions = interventionsModule?.interventions
      ?.filter((i): i is { type: string; name: string } => !!i.type && !!i.name)
      .map((i) => ({ type: i.type, name: i.name }))

    return {
      nctId,
      title,
      summary,
      description: descModule?.detailedDescription || undefined,
      status,
      conditions,
      interventions,
      studyType: designModule?.studyType ?? "Unknown",
      phases: designModule?.phases ?? [],
      eligibility: eligibilityModule?.eligibilityCriteria || undefined,
      gender: eligibilityModule?.sex || undefined,
      minAge: eligibilityModule?.minimumAge || undefined,
      maxAge: eligibilityModule?.maximumAge || undefined,
      healthyVolunteers: eligibilityModule?.healthyVolunteers || undefined,
      sponsor: sponsorModule?.leadSponsor?.name ?? "Unknown Sponsor",
      locations: locations.map((l) => ({
        facility: l.facility || undefined,
        city: l.city!,
        state: l.state!,
        country: l.country || undefined,
      })),
      lastUpdated: statusModule?.lastUpdatePostDate || undefined,
      studyUrl: `https://clinicaltrials.gov/study/${nctId}`,
    }
  }

  normalizeBatch(raw: StudyJson[]): NormalizedClinicalTrial[] {
    const results: NormalizedClinicalTrial[] = []
    for (const item of raw) {
      const normalized = this.normalize(item)
      if (normalized !== null) {
        results.push(normalized)
      }
    }
    return results
  }
}
