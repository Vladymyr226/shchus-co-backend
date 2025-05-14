import { Message } from 'node-telegram-bot-api'
import getBotInstance from '../../../Instances/botInstance'
import { getLogger } from 'nodemailer/lib/shared'

const log = getLogger()
const bot = getBotInstance()

export const startCommandBot = async (msg: Message) => {
  const chatId = msg.chat.id
  if (!msg.from) {
    return bot.sendMessage(chatId, 'Помилка: інформація про користувача недоступна.')
  }

  const { id, username, first_name, last_name } = msg.from

  return bot.sendMessage(
    chatId,
    'Надішліть "так", щоб змінити опис послуги, або "ні", щоб перейти до наступного кроку.'
  )
}
