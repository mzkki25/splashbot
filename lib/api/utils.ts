export const handleTokenTimingError = async (error: any): Promise<boolean> => {
  if (error.message && error.message.includes("Token used too early")) {
    console.warn("Token timing error detected. Retrying...")
    await new Promise((res) => setTimeout(res, 2000))
    return true
  }
  return false
}
