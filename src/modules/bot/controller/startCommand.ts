import { Message } from 'node-telegram-bot-api'
// import { botRepository } from '../bot.repository'
// import { optionsOfAdmin, optionsOfCustomer } from '../bot.config'
// import { getLogger } from '../../../common/logging'
import getBotInstance from '../../common/bot'
import db from '../../../db/knexKonfig'

// const log = getLogger()
const bot = getBotInstance()

export const startCommandBot = async (msg: Message) => {
  const { id, username, first_name, last_name } = msg.from as { id: number; username: string; first_name: string; last_name: string }
  const chatId = msg.chat.id
  const userId = msg?.text?.split(' ')[1];

  console.log(msg, userId)

  if (!userId) {
    return await bot.sendMessage(chatId, '❌ Не удалось получить ID пользователя. Попробуйте еще раз.')
  }
  const botUser = await db('bot_users').where({ user_id: userId }).first()

if(botUser && botUser.phone) {
  return await bot.sendMessage(
    chatId, 
    `Вітаємо, ${first_name} ${last_name !== undefined ? last_name : ''} 🎉`, 
  )
}
if(!botUser && !botUser.phone) {
    const user = await db('users-ai').where({ id: userId }).first()
    if (user) {
      await db('bot_users').insert({
        user_tg_id: id,
        user_id: userId,
        chat_id: chatId,
        username: username,
        first_name: first_name,
        last_name: last_name,
      })
    }
}

  const keyboard = {
    reply_markup: {
      keyboard: [
        [
          {
            text: '📱 Поделиться номером телефона',
            request_contact: true
          }
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  }

  await bot.sendMessage(
    chatId, 
    `Вітаємо, ${first_name} ${last_name !== undefined ? last_name : ''} 🎉\n\nДля получения уведомлений поделитесь своим номером телефона, нажав кнопку ниже:`, 
    keyboard
  )
}
