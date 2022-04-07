import React, { useEffect } from "react"
import { Categorization } from "../../core/models";
import { useMutableState } from "../hooks/useMutableState";
import * as categorizationAPI from "../../services/categorizationAPI"

export default () => {
  const state = useMutableState<{ categorization: Categorization }>({categorization: []})

  useEffect(() => {
    categorizationAPI.getCategorization().then(d => state.categorization = d.body)
  }, [])

  const saveCategorization = async () => {
    await categorizationAPI.setCategorization(state.categorization)
  }

  return <>
    <button onClick={saveCategorization}>Save</button>
    <hr />
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
    <button onClick={() => state.categorization.push({ categoryName: "", matchers: [] })}>Add category</button>
  </>
}
