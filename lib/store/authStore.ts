import { StateCreator } from "zustand"
import { getUserId } from "../auth" 

export interface User {
  id: string
  email?: string
  username?: string
}

export interface AuthSlice {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: { id: getUserId() || "" },
  isAuthenticated: !!getUserId(),
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
})
