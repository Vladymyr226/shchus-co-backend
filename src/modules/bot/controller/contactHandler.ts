import { Message } from 'node-telegram-bot-api'
import getBotInstance from '../../common/bot'
import db from '../../../db/knexKonfig'

const bot = getBotInstance()

export const handleContactReceived = async (msg: Message) => {
  try {
    const chatId = msg.chat.id
    const contact = msg.contact
    console.log(msg)
    
    if (!contact || !contact.phone_number) {
      await bot.sendMessage(chatId, '❌ Не удалось получить номер телефона. Попробуйте еще раз.')
      return
    }

    const phoneNumber = contact.phone_number
    const userTgId = msg.from?.id

    console.log('Contact received:', {
      chatId,
      phoneNumber,
      userTgId,
      contact
    })

    // Проверяем, есть ли уже запись с таким номером телефона
    const existingUser = await db('bot_users')
      .where({ user_tg_id: userTgId })
      .first()

    if (existingUser) {
      // Обновляем данные если что-то изменилось
      const updateData: any = {
        phone: phoneNumber,
        updated_at: new Date(),
      }

      await db('bot_users')
        .where({ user_id: existingUser.user_id })
        .update(updateData)
      
      return await bot.sendMessage(
        chatId, 
        '✅ Номер телефона обновлен! Теперь вы будете получать уведомления.',
        {
          reply_markup: {
            remove_keyboard: true
          }
        }
      )
    }

    return await bot.sendMessage(
      msg.chat.id, 
      '❌ Произошла ошибка при обработке номера телефона. Попробуйте позже.'
    )
  } catch (error) {
    console.error('Error handling contact:', error)
    await bot.sendMessage(
      msg.chat.id, 
      '❌ Произошла ошибка при обработке номера телефона. Попробуйте позже.'
    )
  }
}
