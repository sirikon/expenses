export type Source = {
  id: string;
  name: string;
  credsScheme: { [key: string]: "text" | "password" }
}
