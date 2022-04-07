import create from "zustand"

export type LoadingStore = {
  loading: string | null
}

export const useLoadingStore = create<LoadingStore>(() => ({
  loading: null
}))

export const useLoading = () => {
  return {
    whileLoading: async <T>(message: string, cb: () => Promise<T>): Promise<T> => {
      useLoadingStore.setState((s) => ({ ...s, loading: message }))
      try {
        return await cb();
      } finally {
        useLoadingStore.setState((s) => ({ ...s, loading: null }))
      }
    }
  }
}
