import TelegramBot from 'node-telegram-bot-api'

let botInstance: TelegramBot | null = null

const getBotInstance = () => {
  if (!botInstance) {
    botInstance = new TelegramBot(process.env.TG_BOT_TOKEN || '', {
      polling: {
        interval: 300,
        autoStart: true,
        params: {
          timeout: 10,
        },
      },
    })

    // Обработка ошибок polling
    botInstance.on('polling_error', (error) => {
      console.error('Polling error:', error.message)
      if (error.message.includes('409 Conflict')) {
        console.log('Bot instance conflict detected. This is normal during deployment.')
      }
    })

    // Обработка успешного запуска
    botInstance.on('polling_error', (error) => {
      if (!error.message.includes('409 Conflict')) {
        console.error('Unexpected polling error:', error)
      }
    })
  }
  return botInstance
}

export default getBotInstance
