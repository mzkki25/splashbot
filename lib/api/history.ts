import { ChatHistoryItem } from "./types"
import { handleTokenTimingError } from "./utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE

export const historyApi = {
  getChatHistory: async (token: string): Promise<ChatHistoryItem[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      if (await handleTokenTimingError(error)) return historyApi.getChatHistory(token)
      throw error
    }
  },

  deleteChat: async (chatId: string, token: string): Promise<{ success: boolean }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/history/${chatId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      if (await handleTokenTimingError(error)) return historyApi.deleteChat(chatId, token)
      throw error
    }
  },

  clearAllChats: async (token: string): Promise<{ success: boolean }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/history`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      if (await handleTokenTimingError(error)) return historyApi.clearAllChats(token)
      throw error
    }
  },
}
