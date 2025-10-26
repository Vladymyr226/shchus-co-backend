import { Message } from 'node-telegram-bot-api'
// import { botRepository } from '../bot.repository'
// import { optionsOfAdmin, optionsOfCustomer } from '../bot.config'
// import { getLogger } from '../../../common/logging'
import getBotInstance from '../../common/bot'

// const log = getLogger()
const bot = getBotInstance()

export const startCommandBot = async (msg: Message) => {
  const { id, username, first_name, last_name } = msg.from as { id: number; username: string; first_name: string; last_name: string }
  const chatId = msg.chat.id

  console.log(id, username, first_name, last_name, chatId)

  // const user = await botRepository.postVerifyPhoneNumber()

  // console.log(user)

  await bot.sendMessage(chatId, `Вітаємо, ${first_name} ${last_name !== undefined ? last_name : ''} 🎉`)
}
