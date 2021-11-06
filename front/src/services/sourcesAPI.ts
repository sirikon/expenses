import { array, object, string, union, unknown } from "superstruct"
import { SourceModel } from "../core/models"
import { response, request } from "../utils/api"

export const getSources = () =>
  request(union([
    response(200, array(SourceModel)),
    response(400, unknown())
  ]), "GET", "/api/v1/sources")

export const login = (sourceId: string, data: unknown) =>
  request(union([
    response(200, unknown()),
    response(400, object({ message: string() }))
  ]), "POST", `/api/v1/sources/${sourceId}/login`, data)

export const collect = (sourceId: string) =>
  request(response(200, unknown()), "POST", `/api/v1/sources/${sourceId}/collect`)
