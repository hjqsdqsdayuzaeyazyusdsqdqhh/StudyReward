import type { ImportStage } from "../types"

export class IntegrationError extends Error {
  public readonly code: string
  public readonly retryable: boolean

  constructor(message: string, code = "INTEGRATION_ERROR", retryable = false) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.retryable = retryable
  }
}

export class NetworkError extends IntegrationError {
  constructor(message = "Network request failed") {
    super(message, "NETWORK_ERROR", true)
  }
}

export class TimeoutError extends IntegrationError {
  constructor(message = "Request timed out") {
    super(message, "TIMEOUT", true)
  }
}

export class InvalidPayloadError extends IntegrationError {
  constructor(message = "Invalid payload received") {
    super(message, "INVALID_PAYLOAD", false)
  }
}

export class DuplicateError extends IntegrationError {
  constructor(message = "Duplicate record detected") {
    super(message, "DUPLICATE", false)
  }
}

export class ConflictError extends IntegrationError {
  constructor(message = "Conflict detected") {
    super(message, "CONFLICT", true)
  }
}

export class ValidationError extends IntegrationError {
  public readonly issues: { path: string; message: string }[]

  constructor(issues: { path: string; message: string }[]) {
    super("Validation failed", "VALIDATION_ERROR", false)
    this.issues = issues
  }
}

export class ImportStageError extends IntegrationError {
  public readonly index: number
  public readonly stage: ImportStage

  constructor(index: number, stage: ImportStage, message: string, code?: string) {
    super(message, code ?? "IMPORT_STAGE_ERROR", false)
    this.index = index
    this.stage = stage
  }
}

export class ProviderNotConnectedError extends IntegrationError {
  constructor(providerId: string) {
    super(`Provider ${providerId} is not connected`, "PROVIDER_NOT_CONNECTED", false)
  }
}

export class RateLimitError extends IntegrationError {
  public readonly retryAfter: number

  constructor(retryAfter = 60) {
    super("Rate limit exceeded", "RATE_LIMIT", true)
    this.retryAfter = retryAfter
  }
}
