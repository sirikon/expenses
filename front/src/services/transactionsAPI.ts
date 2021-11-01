import { Response } from "../core/models"

export type PopulateResponse =
  | Response<200, unknown>

export async function populate(): Promise<PopulateResponse> {
  return (await fetch(url("/api/v1/transactions/populate"), {
    method: "POST"
  })) as PopulateResponse
}

function url(path: string): string {
  return `${EXPENSES_BASE_URL}${path}`;
}
