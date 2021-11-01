import { useContext } from "react"
import { LoadingContext } from "../contexts/loadingContext"

export default () => {
  const ctx = useContext(LoadingContext)
  return {
    whileLoading: async <T>(message: string, cb: () => Promise<T>): Promise<T> => {
      ctx.setLoading(message)
      try {
        return await cb();
      } finally {
        ctx.setLoading(null)
      }
    }
  }
}
