import { Request, Response } from 'express'
import knex from '../../../db/knexKonfig.js'
import { ExpressRequest } from '../middlewares/user.auth'


// Отримання загального чату за slug
export const getPublicChatBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params

    const publicChat = await knex('public_chats_ai')
      .where('slug', slug)
      .where('is_active', true)
      .first()

    if (!publicChat) {
      return res.status(404).json({ message: 'Public chat not found', success: false })
    }

    // Отримуємо останнє повідомлення
    const lastMessage = await knex('public_chat_messages_ai')
      .leftJoin('users-ai', 'public_chat_messages_ai.sender_id', 'users-ai.id')
      .where('public_chat_messages_ai.public_chat_id', publicChat.id)
      .orderBy('public_chat_messages_ai.created_at', 'desc')
      .select(
        'public_chat_messages_ai.*',
        'users-ai.name as sender_name',
        'users-ai.avatar as sender_avatar'
      )
      .first()

    // Отримуємо кількість повідомлень за сьогодні
    const todayMessagesCount = await knex('public_chat_messages_ai')
      .where('public_chat_id', publicChat.id)
      .where('created_at', '>=', knex.raw('CURRENT_DATE'))
      .count('id as count')
      .first()

    return res.status(200).json({
      success: true,
      data: {
        ...publicChat,
        lastMessage: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          senderName: lastMessage.sender_name,
          senderAvatar: lastMessage.sender_avatar,
          timestamp: lastMessage.created_at,
        } : null,
        todayMessagesCount: parseInt(String(todayMessagesCount?.count || '0')),
      },
    })
  } catch (error) {
    console.error('Error getting public chat:', error)
    return res.status(500).json({
      message: 'Failed to get public chat',
      success: false,
      error,
    })
  }
}



// Закріплення/відкріплення повідомлення
export const togglePinMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as ExpressRequest).user_id
    const { messageId } = req.params

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false })
    }

    // Отримуємо повідомлення
    const message = await knex('public_chat_messages_ai')
      .where('id', messageId)
      .first()

    if (!message) {
      return res.status(404).json({ message: 'Message not found', success: false })
    }

    // Перевіряємо, чи користувач є автором повідомлення
    if (message.sender_id !== userId) {
      return res.status(403).json({ message: 'You can only pin your own messages', success: false })
    }

    // Перемикаємо статус закріплення
    const [updatedMessage] = await knex('public_chat_messages_ai')
      .where('id', messageId)
      .update({
        is_pinned: !message.is_pinned,
      })
      .returning('*')

    return res.status(200).json({
      success: true,
      data: {
        id: updatedMessage.id,
        isPinned: updatedMessage.is_pinned,
      },
    })
  } catch (error) {
    console.error('Error toggling pin message:', error)
    return res.status(500).json({
      message: 'Failed to toggle pin message',
      success: false,
      error,
    })
  }
}

// Отримання статистики загального чату
export const getPublicChatStats = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params

    const publicChat = await knex('public_chats_ai')
      .where('slug', slug)
      .where('is_active', true)
      .first()

    if (!publicChat) {
      return res.status(404).json({ message: 'Public chat not found', success: false })
    }

    // Отримуємо статистику
    const stats = await knex('public_chat_messages_ai')
      .where('public_chat_id', publicChat.id)
      .select(
        knex.raw('COUNT(*) as total_messages'),
        knex.raw('COUNT(DISTINCT sender_id) as unique_senders'),
        knex.raw('COUNT(CASE WHEN created_at >= NOW() - INTERVAL \'24 hours\' THEN 1 END) as messages_today'),
        knex.raw('COUNT(CASE WHEN created_at >= NOW() - INTERVAL \'7 days\' THEN 1 END) as messages_week')
      )
      .first()

    return res.status(200).json({
      success: true,
      data: {
        chat: publicChat,
        stats: {
          totalMessages: parseInt(stats.total_messages) || 0,
          uniqueSenders: parseInt(stats.unique_senders) || 0,
          messagesToday: parseInt(stats.messages_today) || 0,
          messagesWeek: parseInt(stats.messages_week) || 0,
        },
      },
    })
  } catch (error) {
    console.error('Error getting public chat stats:', error)
    return res.status(500).json({
      message: 'Failed to get public chat stats',
      success: false,
      error,
    })
  }
}
