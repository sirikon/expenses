import { unknown } from "superstruct";
import { request, response } from "../utils/api";

const PopulateResponse = response(200, unknown())

export const populate = async () =>
  request(PopulateResponse, "POST", "/api/v1/transactions/populate")
