import { useEffect, useState } from "react"
import hyperactiv from "hyperactiv"
const { observe, computed, dispose } = hyperactiv

export const useMutableState = <T>(initial: T): T => {
  const [, setIter] = useState(0);
  const [state] = useState(observe(initial))
  useEffect(() => {
    const fn = () => {
      JSON.stringify(state)
      setIter(s => s+1)
    }
    computed(fn)
    return () => { dispose(fn) }
  }, [])
  return state
}
