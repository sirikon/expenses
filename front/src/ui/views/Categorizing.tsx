import React from "react"
import { useMutableState } from "../hooks/useMutableState";

type State = {
  categoryName: string;
  matchers: {
    condition: "equals" | "like",
    value: string;
  }[];
}[]

export default () => {
  const state = useMutableState<State>([])
  return <>
    <button>Save</button>
    <hr />
    {state.map((c, ci) => <p>
      <input type="text" value={c.categoryName} onChange={(e) => c.categoryName = e.target.value} />
      <button onClick={() => state.splice(ci, 1)}>-</button>
      <ul>
        {c.matchers.map(((m, mi) => <li>
          <select value={m.condition} onChange={(e) => m.condition = e.target.value === "equals" ? "equals" : "like"}>
            <option value="equals">equals</option>
            <option value="like">like</option>
          </select>
          <input type="text" value={m.value} onChange={(e) => m.value = e.target.value} />
          <button onClick={() => c.matchers.splice(mi, 1)}>-</button>
        </li>))}
        <button onClick={() => c.matchers.push({ condition: "equals", value: "" })}>Add matcher</button>
      </ul>
    </p>)}
    <button onClick={() => state.push({ categoryName: "", matchers: [] })}>Add category</button>
  </>
}
