import { array, object, string, union, unknown } from "superstruct"
import { SourceModel } from "../core/models"
import { response, request } from "../utils/api"

export const getSources = () =>
  request(response(200, array(SourceModel)), "GET", "/api/v1/sources")

export const login = (sourceId: string, data: unknown) =>
  request(union([
    response(200, unknown()),
    response(500, object({ message: string() }))
  ]), "POST", `/api/v1/sources/${sourceId}/login`, data)

export const collect = (sourceId: string) =>
  request(union([
    response(200, unknown()),
    response(500, object({ message: string() }))
  ]), "POST", `/api/v1/sources/${sourceId}/collect`)
