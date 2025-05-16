import { ChatRequest, ChatResponse } from "./types"
import { handleTokenTimingError } from "./utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE

export const chatApi = {
  sendChatMessage: async (chatSessionId: string, request: ChatRequest, token: string): Promise<ChatResponse> => {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/${chatSessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(request),
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      if (await handleTokenTimingError(error)) return chatApi.sendChatMessage(chatSessionId, request, token)
      throw error
    }
  },
}
