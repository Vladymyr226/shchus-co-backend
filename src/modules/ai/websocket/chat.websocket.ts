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

    // ========== ЗАГАЛЬНІ ЧАТИ ==========

    // Підключення до загального чату
    socket.on('join_public_chat', async (data: { slug: string }) => {
      console.log(`[WebSocket] join_public_chat request from user ${socket.userId} for chat ${data.slug}`)
      try {
        const { slug } = data

        // Перевіряємо, чи існує загальний чат
        const publicChat = await knex('public_chats_ai')
          .where('slug', slug)
          .where('is_active', true)
          .first()

        if (!publicChat) {
          socket.emit('error', { message: 'Public chat not found' })
          return
        }

        // Приєднуємося до кімнати загального чату
        socket.join(`public_chat:${publicChat.id}`)

        // Відправляємо підтвердження
        socket.emit('public_chat_joined', {
          type: 'public_chat_joined',
          chat: publicChat,
        })

        console.log(`[WebSocket] User ${socket.userId} joined public chat ${slug}`)
      } catch (error) {
        console.error(`[WebSocket] Error joining public chat for user ${socket.userId}:`, error)
        socket.emit('error', { message: 'Failed to join public chat' })
      }
    })

    // Відключення від загального чату
    socket.on('leave_public_chat', async (data: { slug: string }) => {
      console.log(`[WebSocket] leave_public_chat request from user ${socket.userId} for chat ${data.slug}`)
      try {
        const { slug } = data

        const publicChat = await knex('public_chats_ai')
          .where('slug', slug)
          .where('is_active', true)
          .first()

        if (publicChat) {
          socket.leave(`public_chat:${publicChat.id}`)
          socket.emit('public_chat_left', {
            type: 'public_chat_left',
            chatId: publicChat.id,
          })
        }
      } catch (error) {
        console.error(`[WebSocket] Error leaving public chat for user ${socket.userId}:`, error)
      }
    })

    // Відправка повідомлення в загальний чат
    socket.on('public_chat_message', async (data: { slug: string; content: string; replyToId?: number }) => {
      console.log(`[WebSocket] public_chat_message from user ${socket.userId} in chat ${data.slug}`)
      try {
        const { slug, content, replyToId } = data
        const senderId = socket.userId!

        // Перевіряємо, чи існує загальний чат
        const publicChat = await knex('public_chats_ai')
          .where('slug', slug)
          .where('is_active', true)
          .first()

        if (!publicChat) {
          socket.emit('error', { message: 'Public chat not found' })
          return
        }

        // Перевіряємо, чи користувач в кімнаті
        const rooms = Array.from(socket.rooms)
        if (!rooms.includes(`public_chat:${publicChat.id}`)) {
          socket.emit('error', { message: 'You must join the chat first' })
          return
        }

        // Перевіряємо, чи існує повідомлення для відповіді
        let replyToIdValid: number | null = null
        if (replyToId) {
          const replyMessage = await knex('public_chat_messages_ai')
            .where('id', replyToId)
            .where('public_chat_id', publicChat.id)
            .first()

          if (replyMessage) {
            replyToIdValid = replyToId
          }
        }

        // Зберігаємо повідомлення
        const [message] = await knex('public_chat_messages_ai')
          .insert({
            public_chat_id: publicChat.id,
            sender_id: senderId,
            content: content.trim(),
            reply_to_id: replyToIdValid,
          })
          .returning('*')

        // Отримуємо інформацію про відправника
        const sender = await knex('users-ai')
          .select('id', 'name', 'avatar')
          .where('id', senderId)
          .first()

        // Формуємо повідомлення для відправки
        const messageData = {
          type: 'public_chat_message',
          id: message.id,
          publicChatId: message.public_chat_id,
          content: message.content,
          senderId: message.sender_id,
          senderName: sender.name,
          senderAvatar: sender.avatar,
          isPinned: message.is_pinned,
          replyTo: replyToIdValid ? {
            id: replyToIdValid,
            content: message.reply_content,
            senderName: message.reply_sender_name
          } : null,
          timestamp: message.created_at,
          slug: publicChat.slug,
        }

        // Відправляємо всім в кімнаті загального чату
        io.to(`public_chat:${publicChat.id}`).emit('public_chat_message', messageData)

        console.log(`[WebSocket] Public chat message sent in ${slug} by user ${senderId}`)
      } catch (error) {
        console.error(`[WebSocket] Error sending public chat message for user ${socket.userId}:`, error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Отримання історії загального чату
    socket.on('get_public_chat_history', async (data: { slug: string; limit?: number; offset?: number }) => {
      console.log(`[WebSocket] get_public_chat_history request from user ${socket.userId} for chat ${data.slug}`)
      try {
        const { slug, limit = 50, offset = 0 } = data
        const userId = socket.userId!

        // Перевіряємо, чи існує загальний чат
        const publicChat = await knex('public_chats_ai')
          .where('slug', slug)
          .where('is_active', true)
          .first()

        if (!publicChat) {
          socket.emit('error', { message: 'Public chat not found' })
          return
        }

        // Отримуємо повідомлення з інформацією про відправників
        const messages = await knex('public_chat_messages_ai')
          .leftJoin('users-ai', 'public_chat_messages_ai.sender_id', 'users-ai.id')
          .leftJoin('public_chat_messages_ai as replies', 'public_chat_messages_ai.reply_to_id', 'replies.id')
          .leftJoin('users-ai as reply_sender', 'replies.sender_id', 'reply_sender.id')
          .where('public_chat_messages_ai.public_chat_id', publicChat.id)
          .orderBy('public_chat_messages_ai.created_at', 'desc')
          .limit(Number(limit))
          .offset(Number(offset))
          .select(
            'public_chat_messages_ai.*',
            'users-ai.name as sender_name',
            'users-ai.avatar as sender_avatar',
            'replies.content as reply_content',
            'reply_sender.name as reply_sender_name'
          )

        // Формуємо відповідь
        const formattedMessages = messages.reverse().map((msg) => ({
          id: msg.id,
          publicChatId: msg.public_chat_id,
          content: msg.content,
          senderId: msg.sender_id,
          senderName: msg.sender_name,
          senderAvatar: msg.sender_avatar,
          isPinned: msg.is_pinned,
          replyTo: msg.reply_to_id ? {
            id: msg.reply_to_id,
            content: msg.reply_content,
            senderName: msg.reply_sender_name
          } : null,
          timestamp: msg.created_at,
        }))

        socket.emit('public_chat_history', {
          type: 'public_chat_history',
          chat: publicChat,
          messages: formattedMessages,
        })
      } catch (error) {
        console.error(`[WebSocket] Error getting public chat history for user ${socket.userId}:`, error)
        socket.emit('error', { message: 'Failed to get chat history' })
      }
    })

    // Отримання списку загальних чатів
    socket.on('get_public_chats', async (data: { timestamp: string }) => {
      console.log(`[WebSocket] get_public_chats request from user ${socket.userId}`)
      try {
        const publicChats = await knex('public_chats_ai')
          .where('is_active', true)
          .orderBy('created_at', 'asc')
          .select('*')

        // Для кожного загального чату отримуємо додаткову інформацію
        const chatsWithDetails = await Promise.all(
          publicChats.map(async (chat) => {
            // Отримуємо останнє повідомлення
            const lastMessage = await knex('public_chat_messages_ai')
              .leftJoin('users-ai', 'public_chat_messages_ai.sender_id', 'users-ai.id')
              .where('public_chat_messages_ai.public_chat_id', chat.id)
              .orderBy('public_chat_messages_ai.created_at', 'desc')
              .select(
                'public_chat_messages_ai.*',
                'users-ai.name as sender_name',
                'users-ai.avatar as sender_avatar'
              )
              .first()

            // Отримуємо кількість повідомлень за сьогодні
            const todayMessagesCount = await knex('public_chat_messages_ai')
              .where('public_chat_id', chat.id)
              .where('created_at', '>=', knex.raw('CURRENT_DATE'))
              .count('id as count')
              .first()

            return {
              ...chat,
              lastMessage: lastMessage ? {
                id: lastMessage.id,
                content: lastMessage.content,
                senderName: lastMessage.sender_name,
                senderAvatar: lastMessage.sender_avatar,
                timestamp: lastMessage.created_at,
              } : null,
              todayMessagesCount: parseInt(String(todayMessagesCount?.count || '0')),
            }
          })
        )

        // Відправляємо всі загальні чати з деталями
        socket.emit('public_chats_list', {
          type: 'public_chats_list',
          chats: chatsWithDetails,
        })
      } catch (error) {
        console.error(`[WebSocket] Error getting public chats for user ${socket.userId}:`, error)
        socket.emit('error', { message: 'Failed to get public chats' })
      }
    })

    // Відключення
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId} (${socket.userName})`)
    })
  })

  return io
}

