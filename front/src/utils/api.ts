import { literal, object, Struct, validate } from "superstruct"

export const response = <Status extends number, Body>(status: Status, body: Struct<Body>) =>
  object({
    status: literal(status),
    body
  })

export const request = async <T>(struct: Struct<T>, method: "GET" | "POST", url: string, body?: unknown): Promise<T> => {
  const fetchResponse = await fetch(`${EXPENSES_BASE_URL}${url}`, {
    method,
    ...(body != null ? {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    } : {})
  })
  const unsafeResponse = {
    status: fetchResponse.status,
    body: await fetchResponse.json()
  }

  const [err, response] = validate(unsafeResponse, struct)
  if (err != null) {
    console.log(JSON.stringify(err.failures(), null, 2));
    throw err;
  }
  return response as T;
}
