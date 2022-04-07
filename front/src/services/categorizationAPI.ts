import { union, unknown } from "superstruct"
import { Categorization, CategorizationModel } from "../core/models"
import { response, request } from "../utils/api"

export const getCategorization = () =>
  request(response(200, CategorizationModel), "GET", "/api/v1/categorization")

export const setCategorization = (data: Categorization) =>
  request(union([
    response(200, unknown()),
  ]), "POST", "/api/v1/categorization", data)
