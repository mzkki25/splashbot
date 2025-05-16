import { UploadResponse } from "./types"
import { handleTokenTimingError } from "./utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE

export const uploadApi = {
  uploadFile: async (file: File, token: string): Promise<UploadResponse> => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      if (await handleTokenTimingError(error)) return uploadApi.uploadFile(file, token)
      throw error
    }
  },
}
