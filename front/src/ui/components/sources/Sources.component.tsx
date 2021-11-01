import React, { useState, useEffect } from "react"
import { Source } from "../../../core/models"
import * as sourcesAPI from "../../../services/sourcesAPI"
import useLoading from "../../hooks/useLoading";

export default () => {
  const sources = useSources();
  const { whileLoading } = useLoading();

  const login = async (s: Source) => {
    const data: Record<string, string> = {}
    const keys = Object.keys(s.credsScheme)
    for (const key of keys) {
      data[key] = prompt(`Insert: ${key}`) || "";
    }

    const result = await whileLoading("Logging in",
      () => sourcesAPI.login(s.id, data))

    if (result.status === 200) {
      alert("Logged in")
    } else if (result.status === 400) {
      alert((await result.json()).message)
    } else {
      alert("Unexpected error")
    }
  }

  const collect = async (s: Source) => {
    const result = await whileLoading("Collecting...",
      () => sourcesAPI.collect(s.id))
    if (result.status !== 200) {
      alert("Unexpected error")
    }
  }

  return <>
    <h3>Sources</h3>
    <ul>
      {sources.map(s => <li>
        <span>{s.name} </span>
        <button type="button" onClick={() => login(s)}>Login</button>
        <button type="button" onClick={() => collect(s)}>Collect</button>
      </li>)}
    </ul>
  </>
}

const useSources = () => {
  const [sources, setSources] = useState<Source[]>([])

  useEffect(() => {
    sourcesAPI.getSources().then(setSources)
  }, [])

  return sources;
}
