import { Request, Response } from 'express'
import knex from '../../../db/knexKonfig.js'
import { ExpressRequest } from '../middlewares/user.auth'

// Отримання всіх чатів користувача
export const getUserChats = async (req: Request, res: Response) => {
  try {
    const userId = (req as ExpressRequest).user_id

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false })
    }

    // Отримуємо всі чати користувача
    const chats = await knex('chats_ai')
      .where('user1_id', userId)
      .orWhere('user2_id', userId)
      .orderBy('updated_at', 'desc')

    // Для кожного чату отримуємо додаткову інформацію
    const chatsWithDetails = await Promise.all(
      chats.map(async (chat) => {
        // Визначаємо співрозмовника
        const otherUserId = chat.user1_id === userId ? chat.user2_id : chat.user1_id

        // Отримуємо інформацію про співрозмовника
        const otherUser = await knex('users-ai')
          .select('id', 'name', 'avatar')
          .where('id', otherUserId)
          .first()

        // Отримуємо останнє повідомлення
        const lastMessage = await knex('chat_messages_ai')
          .where('chat_id', chat.id)
          .orderBy('created_at', 'desc')
          .first()

        // Отримуємо кількість непрочитаних повідомлень
        const unreadCount = await knex('chat_messages_ai')
          .where('chat_id', chat.id)
          .where('receiver_id', userId)
          .where('is_read', false)
          .count('id as count')
          .first()

        return {
          id: chat.id,
          userId: otherUser.id,
          userName: otherUser.name,
          userAvatar: otherUser.avatar,
          lastMessage: lastMessage?.content || null,
          lastMessageTime: lastMessage?.created_at || null,
          unreadCount: unreadCount?.count || 0,
          isOnline: false, // TODO: implement online status
          createdAt: chat.created_at,
          updatedAt: chat.updated_at,
        }
      })
    )

    return res.status(200).json({
      success: true,
      data: chatsWithDetails,
    })
  } catch (error) {
    console.error('Error getting user chats:', error)
    return res.status(500).json({
      message: 'Failed to get chats',
      success: false,
      error,
    })
  }
}

// Отримання або створення чату з користувачем
export const getOrCreateChat = async (req: Request, res: Response) => {
  try {
    const userId = (req as ExpressRequest).user_id
    const { targetUserId } = req.body

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false })
    }

    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID is required', success: false })
    }

    if (targetUserId === userId) {
      return res.status(400).json({ message: 'Cannot create chat with yourself', success: false })
    }

    // Перевіряємо, чи існує співрозмовник
    const targetUser = await knex('users-ai').where('id', targetUserId).first()

    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found', success: false })
    }

    // Перевіряємо, чи існує вже чат між цими користувачами
    let chat = await knex('chats_ai')
      .where(function () {
        this.where('user1_id', userId).andWhere('user2_id', targetUserId)
      })
      .orWhere(function () {
        this.where('user1_id', targetUserId).andWhere('user2_id', userId)
      })
      .first()

    // Якщо чату немає, створюємо новий
    if (!chat) {
      const [newChat] = await knex('chats_ai')
        .insert({
          user1_id: Math.min(userId, targetUserId),
          user2_id: Math.max(userId, targetUserId),
        })
        .returning('*')

      chat = newChat
    }

    // Отримуємо останнє повідомлення
    const lastMessage = await knex('chat_messages_ai')
      .where('chat_id', chat.id)
      .orderBy('created_at', 'desc')
      .first()

    // Отримуємо кількість непрочитаних повідомлень
    const unreadCount = await knex('chat_messages_ai')
      .where('chat_id', chat.id)
      .where('receiver_id', userId)
      .where('is_read', false)
      .count('id as count')
      .first()

    return res.status(200).json({
      success: true,
      data: {
        id: chat.id,
        userId: targetUser.id,
        userName: targetUser.name,
        userAvatar: targetUser.avatar,
        lastMessage: lastMessage?.content || null,
        lastMessageTime: lastMessage?.created_at || null,
        unreadCount: unreadCount?.count || 0,
        isOnline: false,
        createdAt: chat.created_at,
        updatedAt: chat.updated_at,
      },
    })
  } catch (error) {
    console.error('Error getting or creating chat:', error)
    return res.status(500).json({
      message: 'Failed to get or create chat',
      success: false,
      error,
    })
  }
}

// Отримання історії повідомлень чату
export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const userId = (req as ExpressRequest).user_id
    const { chatId } = req.params
    const { limit = 50, offset = 0 } = req.query

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false })
    }

    // Перевіряємо, чи користувач є учасником чату
    const chat = await knex('chats_ai')
      .where('id', chatId)
      .where(function () {
        this.where('user1_id', userId).orWhere('user2_id', userId)
      })
      .first()

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found or access denied', success: false })
    }

    // Отримуємо повідомлення
    const messages = await knex('chat_messages_ai')
      .where('chat_id', chatId)
      .orderBy('created_at', 'desc')
      .limit(Number(limit))
      .offset(Number(offset))
      .select('*')

    // Отримуємо загальну кількість повідомлень
    const totalCount = await knex('chat_messages_ai').where('chat_id', chatId).count('id as count').first()

    // Позначаємо непрочитані повідомлення як прочитані
    await knex('chat_messages_ai')
      .where('chat_id', chatId)
      .where('receiver_id', userId)
      .where('is_read', false)
      .update({ is_read: true })

    // Формуємо відповідь
    const formattedMessages = messages.reverse().map((msg) => ({
      id: msg.id,
      chatId: msg.chat_id,
      text: msg.content,
      sender: msg.sender_id === userId ? 'me' : 'other',
      senderId: msg.sender_id,
      receiverId: msg.receiver_id,
      timestamp: msg.created_at,
      isRead: msg.is_read,
    }))

    return res.status(200).json({
      success: true,
      data: {
        messages: formattedMessages,
        total: totalCount?.count || 0,
        limit: Number(limit),
        offset: Number(offset),
      },
    })
  } catch (error) {
    console.error('Error getting chat messages:', error)
    return res.status(500).json({
      message: 'Failed to get chat messages',
      success: false,
      error,
    })
  }
}

// Відправка повідомлення (REST API альтернатива WebSocket)
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as ExpressRequest).user_id
    const { chatId } = req.params
    const { content } = req.body

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false })
    }

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Message content is required', success: false })
    }

    // Перевіряємо, чи користувач є учасником чату
    const chat = await knex('chats_ai')
      .where('id', chatId)
      .where(function () {
        this.where('user1_id', userId).orWhere('user2_id', userId)
      })
      .first()

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found or access denied', success: false })
    }

    // Визначаємо отримувача
    const receiverId = chat.user1_id === userId ? chat.user2_id : chat.user1_id

    // Зберігаємо повідомлення в базі даних
    const [message] = await knex('chat_messages_ai')
      .insert({
        chat_id: chatId,
        sender_id: userId,
        receiver_id: receiverId,
        content: content.trim(),
      })
      .returning('*')

    // Оновлюємо час останнього оновлення чату
    await knex('chats_ai').where('id', chatId).update({
      updated_at: knex.fn.now(),
    })

    return res.status(201).json({
      success: true,
      data: {
        id: message.id,
        chatId: message.chat_id,
        text: message.content,
        sender: 'me',
        senderId: message.sender_id,
        receiverId: message.receiver_id,
        timestamp: message.created_at,
        isRead: message.is_read,
      },
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return res.status(500).json({
      message: 'Failed to send message',
      success: false,
      error,
    })
  }
}

// Видалення чату
export const deleteChat = async (req: Request, res: Response) => {
  try {
    const userId = (req as ExpressRequest).user_id
    const { chatId } = req.params

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false })
    }

    // Перевіряємо, чи користувач є учасником чату
    const chat = await knex('chats_ai')
      .where('id', chatId)
      .where(function () {
        this.where('user1_id', userId).orWhere('user2_id', userId)
      })
      .first()

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found or access denied', success: false })
    }

    // Видаляємо чат (повідомлення видаляться автоматично через CASCADE)
    await knex('chats_ai').where('id', chatId).delete()

    return res.status(200).json({
      success: true,
      message: 'Chat deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting chat:', error)
    return res.status(500).json({
      message: 'Failed to delete chat',
      success: false,
      error,
    })
  }
}

// Позначення всіх повідомлень чату як прочитаних
export const markChatAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as ExpressRequest).user_id
    const { chatId } = req.params

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false })
    }

    // Перевіряємо, чи користувач є учасником чату
    const chat = await knex('chats_ai')
      .where('id', chatId)
      .where(function () {
        this.where('user1_id', userId).orWhere('user2_id', userId)
      })
      .first()

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found or access denied', success: false })
    }

    // Позначаємо всі непрочитані повідомлення як прочитані
    await knex('chat_messages_ai')
      .where('chat_id', chatId)
      .where('receiver_id', userId)
      .where('is_read', false)
      .update({ is_read: true })

    return res.status(200).json({
      success: true,
      message: 'Chat marked as read',
    })
  } catch (error) {
    console.error('Error marking chat as read:', error)
    return res.status(500).json({
      message: 'Failed to mark chat as read',
      success: false,
      error,
    })
  }
}

// Отримання користувача за ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as ExpressRequest).user_id
    const { userId } = req.params

    if (!currentUserId) {
      return res.status(401).json({ message: 'Unauthorized', success: false })
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required', success: false })
    }

    // Отримуємо користувача за ID
    const user = await knex('users-ai')
      .where('id', userId)
      .select('id', 'name', 'email', 'avatar')
      .first()

    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false })
    }

    return res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return res.status(500).json({
      message: 'Failed to get user',
      success: false,
      error,
    })
  }
}

// Пошук користувачів для створення чату
export const searchUsers = async (req: Request, res: Response) => {
  try {
    const userId = (req as ExpressRequest).user_id
    const { query } = req.query

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false })
    }

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required', success: false })
    }

    // Шукаємо користувачів за ім'ям або email
    const users = await knex('users-ai')
      .where('id', '!=', userId)
      .where(function () {
        this.where('name', 'ilike', `%${query}%`).orWhere('email', 'ilike', `%${query}%`)
      })
      .select('id', 'name', 'email', 'avatar')
      .limit(20)

    return res.status(200).json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error('Error searching users:', error)
    return res.status(500).json({
      message: 'Failed to search users',
      success: false,
      error,
    })
  }
}

