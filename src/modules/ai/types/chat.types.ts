// Типи для чату
export interface Chat {
  id: number
  user1_id: number
  user2_id: number
  created_at: Date
  updated_at: Date
}

export interface ChatMessage {
  id: number
  chat_id: number
  sender_id: number
  receiver_id: number
  content: string
  is_read: boolean
  created_at: Date
}

export interface ChatUser {
  id: number
  name: string
  email: string
  avatar?: string
}

export interface ChatWithDetails {
  id: number
  userId: number
  userName: string
  userAvatar?: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  isOnline: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessageResponse {
  id: number
  chatId: number
  text: string
  sender: 'me' | 'other'
  senderId: number
  receiverId: number
  timestamp: Date
  isRead: boolean
}

export interface ChatHistoryResponse {
  messages: ChatMessageResponse[]
  total: number
  limit: number
  offset: number
}

