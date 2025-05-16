import type { ChatMessage } from "./types"
import { handleTokenTimingError } from "./utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE

export const messagesApi = {
  getChatMessages: async (sessionId: string, token: string): Promise<ChatMessage[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/${sessionId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status === 404) {
        console.log(`Chat session ${sessionId} not found on server, returning empty messages array`)
        return []
      }

      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      if (await handleTokenTimingError(error)) return messagesApi.getChatMessages(sessionId, token)
      throw error
    }
  },
}
