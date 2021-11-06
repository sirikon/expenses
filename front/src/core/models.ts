import { Infer, literal, object, record, string, union } from "superstruct"

export const SourceModel = object({
  id: string(),
  name: string(),
  credsScheme: record(string(), union([
    literal("text"),
    literal("password")
  ]))
})
export type Source = Infer<typeof SourceModel>
