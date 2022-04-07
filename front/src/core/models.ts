import { array, Infer, literal, object, record, string, union } from "superstruct"

export const SourceModel = object({
  id: string(),
  name: string(),
  credsScheme: record(string(), union([
    literal("text"),
    literal("password")
  ]))
})
export type Source = Infer<typeof SourceModel>

export const CategorizationModel = array(object({
  categoryName: string(),
  matchers: array(object({
    query: string(),
    condition: union([literal("equals"), literal("like")]),
    value: string()
  }))
}))
export type Categorization = Infer<typeof CategorizationModel>
