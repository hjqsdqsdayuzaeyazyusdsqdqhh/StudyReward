import { AppError } from "./app-error"

export class DatabaseError extends AppError {
  constructor(message = "A database error occurred") {
    super(message, 500, "DATABASE_ERROR")
  }
}
