import { create } from "zustand"
import { createAuthSlice, AuthSlice } from "./authStore"
import { createChatSessionSlice, ChatSessionSlice } from "./chatSessionStore"
import { createUISlice, UISlice } from "./uiStore"

type AppState = AuthSlice & ChatSessionSlice & UISlice

export const useStore = create<AppState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createChatSessionSlice(...a),
  ...createUISlice(...a),
}))
