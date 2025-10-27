import { ExpressRequest } from '../middlewares/user.auth'
import { Response } from 'express'
import db from '../../../db/knexKonfig'

// Получение статуса активации чатбота
export async function getBotActivationStatus(req: ExpressRequest, res: Response) {
  const user_id = req.user_id

  try {
    // Проверяем статус в новой таблице bot_users
    const botUser = await db('bot_users')
      .where({ user_id })
      .first()

    if (!botUser) {
      return res.status(200).json({
        success: true,
        is_activated: false
      })
    }

    const is_activated = !!(botUser.chat_id && botUser.phone)

    res.status(200).json({
      success: true,
      is_activated
    })
  } catch (error) {
    console.error('Error in getBotActivationStatus:', error)
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    })
  }
}
