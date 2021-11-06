import { array, object, string, union, unknown, Describe, record, literal } from "superstruct"
import { Source } from "../core/models"
import { response, request } from "../utils/api"

const SourceModel: Describe<Source> = object({
  id: string(),
  name: string(),
  credsScheme: record(string(), union([
    literal("text"),
    literal("password")
  ]))
})

const GetSourcesResponseModel = union([
  response(200, array(SourceModel)),
  response(400, unknown())
])

export const getSources = () =>
  request(GetSourcesResponseModel, "GET", "/api/v1/sources")



const LoginResponseModel = union([
  response(200, unknown()),
  response(400, object({ message: string() }))
])

export const login = (sourceId: string, data: unknown) =>
  request(LoginResponseModel, "POST", `/api/v1/sources/${sourceId}/login`, data)



const CollectResponseModel = response(200, unknown())

export const collect = (sourceId: string) =>
  request(CollectResponseModel, "POST", `/api/v1/sources/${sourceId}/collect`)
