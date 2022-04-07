import React, { useEffect, useState } from "react"
import { Categorization, Transaction } from "../../core/models";
import { useMutableState } from "../hooks/useMutableState";
import * as categorizationAPI from "../../services/categorizationAPI"
import * as transactionsAPI from "../../services/transactionsAPI"

export default () => {
  const state = useMutableState<{ categorization: Categorization }>({categorization: []})
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const saveCategorization = async () => {
    await categorizationAPI.setCategorization(state.categorization)
    fetchTransactions()
  }

  const fetchTransactions = async () => {
    setTransactions((await transactionsAPI.getTransactions()).body)
  }

  useEffect(() => {
    categorizationAPI.getCategorization().then(d => state.categorization = d.body)
    fetchTransactions()
  }, [])

  return <>
    <p>
      <button onClick={saveCategorization}>Save</button>
      <hr />
    </p>
    <div className="categorizing">
      <div className="half split-vertical">
        <div style={{maxHeight: 400, overflow: "scroll"}}>
          {state.categorization.map((c, ci) => <p>
            <input type="text" value={c.categoryName} onChange={(e) => c.categoryName = e.target.value} />
            <button onClick={() => state.categorization.splice(ci, 1)}>-</button>
            <ul>
              {c.matchers.map(((m, mi) => <li>
                <input type="text" value={m.query} onChange={(e) => m.query = e.target.value} />
                <select value={m.condition} onChange={(e) => m.condition = e.target.value === "equals" ? "equals" : "like"}>
                  <option value="equals">equals</option>
                  <option value="like">like</option>
                </select>
                <input type="text" value={m.value} onChange={(e) => m.value = e.target.value} />
                <button onClick={() => c.matchers.splice(mi, 1)}>-</button>
              </li>))}
              <button onClick={() => c.matchers.push({ query: "", condition: "equals", value: "" })}>Add matcher</button>
            </ul>
          </p>)}
          <p>
            <button onClick={() => state.categorization.push({ categoryName: "", matchers: [] })}>Add category</button>
          </p>
        </div>
        <div style={{maxHeight: 400, overflow: "scroll"}}>
          <table>
            {transactions.map(t =>
              <tr
                onClick={() => setSelectedTransaction(t)}
                className={selectedTransaction?.id === t.id ? "selected-transaction" : undefined}>
                <td>{t.description}</td>
                <td>{t.amount}</td>
                <td>{t.category}</td>
              </tr>)}
          </table>
          <p>
            
          </p>
        </div>
      </div>
      <div className="half json" style={{maxHeight: 800, overflow: "scroll"}}>
        <pre>{selectedTransaction ? JSON.stringify(selectedTransaction.data, null, 2) : ""}</pre>
      </div>
    </div>
  </>
}
