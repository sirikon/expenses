import { array, unknown } from "superstruct";
import { TransactionModel } from "../core/models";
import { request, response } from "../utils/api";

export const populate = async () =>
  request(response(200, unknown()), "POST", "/api/v1/transactions/populate")

export const getTransactions = async () =>
  request(response(200, array(TransactionModel)), "GET", "/api/v1/transactions")
