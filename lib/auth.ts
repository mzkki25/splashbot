import { authApi } from "./api/auth"

export const storeAuthData = (
  userId: string,
  token: string,
  idToken: string,
  refreshToken: string,
  expiresIn: string,
) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userId", userId)
    localStorage.setItem("token", token)
    localStorage.setItem("idToken", idToken)
    localStorage.setItem("refreshToken", refreshToken)
    localStorage.setItem("tokenExpiry", (Date.now() + Number.parseInt(expiresIn) * 1000).toString())
    localStorage.setItem("tokenIssuedAt", Date.now().toString())

    document.cookie = `idToken=${idToken}; path=/; max-age=${expiresIn}; SameSite=Strict`
  }
}

// Get the stored ID token
export const getIdToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("idToken")
  }
  return null
}

// Get the stored user ID
export const getUserId = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userId")
  }
  return null
}

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window !== "undefined") {
    const idToken = localStorage.getItem("idToken")
    const tokenExpiry = localStorage.getItem("tokenExpiry")

    if (!idToken || !tokenExpiry) {
      return false
    }

    return Date.now() < Number.parseInt(tokenExpiry)
  }
  return false
}

// Check if token is ready to use (to avoid "token used too early" errors)
export const isTokenReady = (): boolean => {
  if (typeof window !== "undefined") {
    const tokenIssuedAt = localStorage.getItem("tokenIssuedAt")

    if (!tokenIssuedAt) {
      return true 
    }

    return Date.now() > Number.parseInt(tokenIssuedAt) + 2000
  }
  return true
}

// Wait until token is ready to use
export const waitForTokenReady = async (): Promise<void> => {
  if (isTokenReady()) {
    return
  }

  const tokenIssuedAt = localStorage.getItem("tokenIssuedAt")
  if (!tokenIssuedAt) {
    return
  }

  const issuedTime = Number.parseInt(tokenIssuedAt)
  const waitTime = Math.max(0, issuedTime + 2000 - Date.now())

  if (waitTime > 0) {
    console.log(`Waiting ${waitTime}ms for token to be ready...`)
    await new Promise((resolve) => setTimeout(resolve, waitTime))
  }
}

// Clear auth data on logout
export const clearAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userId")
    localStorage.removeItem("token")
    localStorage.removeItem("idToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("tokenExpiry")
    localStorage.removeItem("tokenIssuedAt")
    localStorage.removeItem("currentChatSession")

    document.cookie = "idToken=; path=/; max-age=0; SameSite=Strict"
  }
}

// Handle login process including token exchange
export const handleLogin = async (emailOrUsername: string, password: string) => {
  const loginResponse = await authApi.login(emailOrUsername, password)

  console.log("Login response:", loginResponse)

  if (!loginResponse.success || !loginResponse.token || !loginResponse.user_id) {
    throw new Error("Login failed: Invalid response from server")
  }

  try {
    const tokenExchange = await authApi.exchangeToken(loginResponse.token)
    console.log("Token exchange successful:", tokenExchange)

    storeAuthData(
      loginResponse.user_id,
      loginResponse.token,
      tokenExchange.idToken,
      tokenExchange.refreshToken,
      tokenExchange.expiresIn,
    )

    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      userId: loginResponse.user_id,
      idToken: tokenExchange.idToken,
    }
  } catch (error) {
    console.error("Token exchange failed:", error)
    throw new Error("Authentication failed during token exchange")
  }
}

// Handle registration process
export const handleRegister = async (username: string, email: string, password: string) => {
  const registerResponse = await authApi.register(username, email, password)

  if (!registerResponse.success) {
    throw new Error("Registration failed")
  }

  return registerResponse
}

// Generate a new chat session ID
export const generateChatSessionId = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Store current chat session ID
export const storeCurrentChatSession = (sessionId: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentChatSession", sessionId)
  }
}

// Get current chat session ID
export const getCurrentChatSession = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("currentChatSession")
  }
  return null
}
