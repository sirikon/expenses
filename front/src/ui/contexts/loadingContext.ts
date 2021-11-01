import React from "react"

export type LoadingContextType = {
  setLoading: (message: string | null) => void
}

export const LoadingContext = React.createContext<LoadingContextType>({
  setLoading: () => { /**/ }
})
