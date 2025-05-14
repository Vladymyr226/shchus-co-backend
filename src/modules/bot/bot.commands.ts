import getBotInstance from '../../Instances/botInstance'
import { startCommandBot } from './controllers/startCommand'

export const botCommands = () => {
  const bot = getBotInstance()

  bot.onText(/\/start/, startCommandBot)
}
