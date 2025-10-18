import { Server, Socket } from 'socket.io'
import { verifyToken } from '../../../utils/token.utils'
import knex from '../../../db/knexKonfig.js'

interface AuthenticatedSocket extends Socket {
  userId?: number
  userName?: string
  userAvatar?: string
}

interface ChatMessage {
  chatId: string
  content: string
  timestamp: string
}

interface CreateChatPayload {
  userId: string
  userName: string
  userAvatar?: string
  timestamp: string
}

export const setupChatWebSocket = (io: Server) => {
  // Middleware для аутентифікації WebSocket з'єднання
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1]

      if (!token) {
        return next(new Error('Authentication error: No token provided'))
      }

      const decoded = (await verifyToken(token)) as { id: number }

      if (!decoded || !decoded.id) {
        return next(new Error('Authentication error: Invalid token'))
      }

      // Отримуємо інформацію про користувача
      const user = await knex('users-ai')
        .select('id', 'name', 'avatar')
        .where('id', decoded.id)
        .first()

      if (!user) {
        return next(new Error('Authentication error: User not found'))
      }

      socket.userId = user.id
      socket.userName = user.name
      socket.userAvatar = user.avatar

      next()
    } catch (error) {
      console.error('Authentication error:', error)
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId} (${socket.userName})`)

    // Приєднання до особистої кімнати користувача
    socket.join(`user:${socket.userId}`)

    // Створення або отримання чату
    socket.on('create_chat', async (data: CreateChatPayload) => {
      console.log('create_chat', data)
      try {
        const targetUserId = parseInt(data.userId)
        const currentUserId = socket.userId!

        if (targetUserId === currentUserId) {
          socket.emit('error', { message: 'Cannot create chat with yourself' })
          return
        }

        // Перевіряємо, чи існує вже чат між цими користувачами
        let chat = await knex('chats_ai')
          .where(function () {
            this.where('user1_id', currentUserId).andWhere('user2_id', targetUserId)
          })
          .orWhere(function () {
            this.where('user1_id', targetUserId).andWhere('user2_id', currentUserId)
          })
          .first()

        // Якщо чату немає, створюємо новий
        if (!chat) {
          const [newChat] = await knex('chats_ai')
            .insert({
              user1_id: Math.min(currentUserId, targetUserId),
              user2_id: Math.max(currentUserId, targetUserId),
            })
            .returning('*')

          chat = newChat
        }

        // Отримуємо інформацію про співрозмовника
        const otherUser = await knex('users-ai')
          .select('id', 'name', 'avatar')
          .where('id', targetUserId)
          .first()

        // Отримуємо останнє повідомлення
        const lastMessage = await knex('chat_messages_ai')
          .where('chat_id', chat.id)
          .orderBy('created_at', 'desc')
          .first()

        // Отримуємо кількість непрочитаних повідомлень
        const unreadCount = await knex('chat_messages_ai')
          .where('chat_id', chat.id)
          .where('receiver_id', currentUserId)
          .where('is_read', false)
          .count('id as count')
          .first()

        // Приєднуємося до кімнати чату
        socket.join(`chat:${chat.id}`)

        console.log(111111, {
          type: 'chat_created',
          chatId: chat.id,
          userId: otherUser.id,
          userName: otherUser.name,
          userAvatar: otherUser.avatar,
          lastMessage: lastMessage?.content,
          unreadCount: unreadCount?.count || 0,
          isOnline: false, // TODO: implement online status
          createdAt: chat.created_at,
          updatedAt: chat.updated_at,
        })
        // Відправляємо інформацію про чат
        socket.emit('chat_created', {
          type: 'chat_created',
          chatId: chat.id,
          userId: otherUser.id,
          userName: otherUser.name,
          userAvatar: otherUser.avatar,
          lastMessage: lastMessage?.content,
          unreadCount: unreadCount?.count || 0,
          isOnline: false, // TODO: implement online status
          createdAt: chat.created_at,
          updatedAt: chat.updated_at,
        })
      } catch (error) {
        console.error('Error creating chat:', error)
        socket.emit('error', { message: 'Failed to create chat' })
      }
    })

    // Відправка повідомлення
    socket.on('message', async (data: ChatMessage) => {
      try {
        const chatId = parseInt(data.chatId)
        const senderId = socket.userId!

        // Перевіряємо, чи користувач є учасником чату
        const chat = await knex('chats_ai')
          .where('id', chatId)
          .where(function () {
            this.where('user1_id', senderId).orWhere('user2_id', senderId)
          })
          .first()

        if (!chat) {
          socket.emit('error', { message: 'Chat not found or access denied' })
          return
        }

        // Визначаємо отримувача
        const receiverId = chat.user1_id === senderId ? chat.user2_id : chat.user1_id

        // Зберігаємо повідомлення в базі даних
        const [message] = await knex('chat_messages_ai')
          .insert({
            chat_id: chatId,
            sender_id: senderId,
            receiver_id: receiverId,
            content: data.content,
          })
          .returning('*')

        // Оновлюємо час останнього оновлення чату
        await knex('chats_ai').where('id', chatId).update({
          updated_at: knex.fn.now(),
        })

        // Формуємо повідомлення для відправки
        const messageData = {
          type: 'message',
          id: message.id,
          chatId: message.chat_id,
          content: message.content,
          sender: 'me',
          timestamp: message.created_at,
          isRead: message.is_read,
        }

        // Відправляємо повідомлення відправнику
        socket.emit('message', messageData)

        // Відправляємо повідомлення отримувачу
        io.to(`user:${receiverId}`).emit('message', {
          ...messageData,
          sender: 'other',
        })

        // Оновлюємо чат для обох користувачів
        const updatedChat = {
          type: 'chat_updated',
          chatId: chat.id,
          lastMessage: message.content,
          updatedAt: new Date(),
        }

        socket.emit('chat_updated', updatedChat)
        io.to(`user:${receiverId}`).emit('chat_updated', {
          ...updatedChat,
          unreadCount: 1, // Додаємо 1 до непрочитаних для отримувача
        })
      } catch (error) {
        console.error('Error sending message:', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Отримання історії чату
    socket.on('get_history', async (data: { chatId: string; timestamp: string }) => {
      try {
        const chatId = parseInt(data.chatId)
        const userId = socket.userId!

        // Перевіряємо, чи користувач є учасником чату
        const chat = await knex('chats_ai')
          .where('id', chatId)
          .where(function () {
            this.where('user1_id', userId).orWhere('user2_id', userId)
          })
          .first()

        if (!chat) {
          socket.emit('error', { message: 'Chat not found or access denied' })
          return
        }

        // Отримуємо повідомлення
        const messages = await knex('chat_messages_ai')
          .where('chat_id', chatId)
          .orderBy('created_at', 'asc')
          .select('*')

        // Позначаємо повідомлення як прочитані
        await knex('chat_messages_ai')
          .where('chat_id', chatId)
          .where('receiver_id', userId)
          .where('is_read', false)
          .update({ is_read: true })

        // Формуємо відповідь
        const formattedMessages = messages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender_id === userId ? 'me' : 'other',
          timestamp: msg.created_at,
          isRead: msg.is_read,
        }))

        socket.emit('chat_history', {
          type: 'chat_history',
          chatId,
          messages: formattedMessages,
        })
      } catch (error) {
        console.error('Error getting chat history:', error)
        socket.emit('error', { message: 'Failed to get chat history' })
      }
    })

    // Отримання списку чатів
    socket.on('get_chats', async (data: { timestamp: string }) => {
      try {
        const userId = socket.userId!

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

            // Приєднуємося до кімнати чату
            socket.join(`chat:${chat.id}`)

            return {
              type: 'chat_created',
              chatId: chat.id,
              userId: otherUser.id,
              userName: otherUser.name,
              userAvatar: otherUser.avatar,
              lastMessage: lastMessage?.content,
              unreadCount: unreadCount?.count || 0,
              isOnline: false, // TODO: implement online status
              createdAt: chat.created_at,
              updatedAt: chat.updated_at,
            }
          })
        )

        // Відправляємо всі чати
        chatsWithDetails.forEach((chat) => {
          socket.emit('chat_created', chat)
        })
      } catch (error) {
        console.error('Error getting chats:', error)
        socket.emit('error', { message: 'Failed to get chats' })
      }
    })

    // Позначення повідомлень як прочитаних
    socket.on('mark_as_read', async (data: { chatId: string }) => {
      try {
        const chatId = parseInt(data.chatId)
        const userId = socket.userId!

        await knex('chat_messages_ai')
          .where('chat_id', chatId)
          .where('receiver_id', userId)
          .where('is_read', false)
          .update({ is_read: true })

        socket.emit('messages_marked_read', { chatId })
      } catch (error) {
        console.error('Error marking messages as read:', error)
      }
    })

    // Відключення
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId} (${socket.userName})`)
    })
  })

  return io
}

