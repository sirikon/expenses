import { Source, Response } from "../core/models";

export type GetSourcesResponse =
  | Response<200, Source[]>

export async function getSources(): Promise<GetSourcesResponse> {
  return (await fetch(url("/api/v1/sources"))) as GetSourcesResponse;
}


export type LoginResponse =
  | Response<200, unknown>
  | Response<400, { message: string }>

export async function login(sourceId: string, data: unknown): Promise<LoginResponse> {
  return (await fetch(url(`/api/v1/sources/${sourceId}/login`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })) as LoginResponse
}


export type CollectResponse =
  | Response<200, unknown>

export async function collect(sourceId: string): Promise<CollectResponse> {
  return (await fetch(url(`/api/v1/sources/${sourceId}/collect`), {
    method: "POST"
  })) as CollectResponse
}

function url(path: string): string {
  return `${EXPENSES_BASE_URL}${path}`;
}
