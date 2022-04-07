import { array, Infer, literal, number, object, record, string, union, unknown, nullable } from "superstruct"

export const SourceModel = object({
  id: string(),
  name: string(),
  credsScheme: record(string(), union([
    literal("text"),
    literal("password")
  ]))
})
export type Source = Infer<typeof SourceModel>

export const TransactionModel = object({
  id: string(),
  description: string(),
  amount: number(),
  timestamp: number(),
  data: unknown(),
  category: nullable(string())
})
export type Transaction = Infer<typeof TransactionModel>

export const CategorizationModel = array(object({
  categoryName: string(),
  matchers: array(object({
    query: string(),
    condition: union([literal("equals"), literal("like")]),
    value: string()
  }))
}))
export type Categorization = Infer<typeof CategorizationModel>
