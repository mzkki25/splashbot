import type { StateCreator } from "zustand"

export interface UISlice {
  isLoading: boolean
  chatOption: string
  setIsLoading: (isLoading: boolean) => void
  setChatOption: (option: string) => void
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  isLoading: false,
  chatOption: "General Macroeconomics",
  setIsLoading: (isLoading) => set({ isLoading }),
  setChatOption: (option) => set({ chatOption: option }),
})
