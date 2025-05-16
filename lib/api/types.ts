export interface ChatRequest {
  prompt: string
  file_id?: string
  chat_options?: string
  userId?: string
}

export interface ChatResponse {
  response: string
  file_url?: string
  created_at: string
  references?: string[]
  follow_up_question?: string[]
}

export interface UploadResponse {
  success: boolean
  file_id: string
  url: string
}

export interface ChatHistoryItem {
  chat_session_id: string
  title: string
  timestamp: string
}

export interface ChatMessage {
  message_id: string
  chat_session_id: string
  role: "user" | "assistant"
  content: string
  file_id?: string
  timestamp: string
  references?: string[]
}

export interface AuthResponse {
  success: boolean
  user_id?: string
  token?: string
}

export interface TokenExchangeResponse {
  kind: string
  idToken: string
  refreshToken: string
  expiresIn: string
  isNewUser: boolean
}
