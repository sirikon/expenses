import React from "react"
import useLoading from "../../hooks/useLoading"
import * as transactionsAPI from "../../../services/transactionsAPI"

export default () => {

  const { whileLoading } = useLoading()

  const populate = async () => {
    const result = await whileLoading("Populating...",
      () => transactionsAPI.populate())
    if (result.status !== 200) {
      alert("Unexpected error")
    }
  }
  
  return <>
    <h3>Transactions</h3>
    <p>
      <button type="button" onClick={populate}>Populate</button>
    </p>
  </>
}
