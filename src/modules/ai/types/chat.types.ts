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

// Типи для загальних чатів
export interface PublicChat {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  color: string
  is_active: boolean
  max_members: number
  created_at: Date
  updated_at: Date
}

export interface PublicChatWithDetails extends PublicChat {
  lastMessage?: {
    id: number
    content: string
    senderName: string
    senderAvatar?: string
    timestamp: Date
  }
  todayMessagesCount: number
}

export interface PublicChatMessage {
  id: number
  public_chat_id: number
  sender_id: number
  content: string
  is_pinned: boolean
  reply_to_id?: number
  created_at: Date
}

export interface PublicChatMessageResponse {
  id: number
  publicChatId: number
  content: string
  senderId: number
  senderName: string
  senderAvatar?: string
  isPinned: boolean
  replyTo?: {
    id: number
    content: string
    senderName: string
  }
  timestamp: Date
}

export interface PublicChatStats {
  totalMessages: number
  uniqueSenders: number
  messagesToday: number
  messagesWeek: number
}

