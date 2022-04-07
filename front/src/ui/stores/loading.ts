import create from "zustand"

export type GlobalLoadingStore = {
  loading: string | null
}

export const useGlobalLoadingStore = create<GlobalLoadingStore>(() => ({
  loading: null
}))

export const useGlobalLoading = () => {
  return {
    whileGlobalLoading: async <T>(message: string, cb: () => Promise<T>): Promise<T> => {
      useGlobalLoadingStore.setState((s) => ({ ...s, loading: message }))
      try {
        return await cb();
      } finally {
        useGlobalLoadingStore.setState((s) => ({ ...s, loading: null }))
      }
    }
  }
}
