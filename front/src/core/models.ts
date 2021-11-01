export type Source = {
  id: string;
  name: string;
  credsScheme: { [key: string]: "text" | "password" }
}

export type Response<Status extends number, Body> = {
  status: Status,
  json: () => Promise<Body>
}
