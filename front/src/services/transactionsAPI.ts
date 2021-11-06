import { unknown } from "superstruct";
import { request, response } from "../utils/api";

export const populate = async () =>
  request(response(200, unknown()), "POST", "/api/v1/transactions/populate")
