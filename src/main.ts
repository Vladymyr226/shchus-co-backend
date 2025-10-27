import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { createAuthRouter } from './modules/auth/routes/routes'
import cors from 'cors'
import { Router } from 'express'
import './configs/dotenv.config'
import { createCabinetRouter } from './modules/cabinet/shchus/routes/routes'
import { errorHandlerMiddleware } from './middleware/error.middleware'
import http from 'http'
import { setupChatSocket } from './modules/chats/chat'
import { createAIRouter } from './modules/ai/routes/routes'
import { Server } from 'socket.io'
import { setupChatWebSocket } from './modules/ai/websocket/chat.websocket'
import { botCommands } from './modules/bot/bot.commands'
import { configureHealthCheckRouter } from './modules/common/routes/healthcheck.routes'
import { setupCronJobs, stopCronJobs } from './modules/ai/services/cron-scheduler.service'

const app = express()
const server = http.createServer(app)
botCommands()

// Setup Socket.IO for both old and new chat systems
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN_URL || 'http://localhost:3000',
    credentials: true,
  },
})

// const oldChatIo = setupChatSocket(server) // Old chat socket (legacy)
setupChatWebSocket(io) // New chat WebSocket for AI module

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const { PORT } = process.env

function addApiRoutes() {
  const router = Router({ mergeParams: true })

  router.use('/ai', createAIRouter())
  router.use('/auth', createAuthRouter())
  router.use('/cabinet', createCabinetRouter())

  return router
}

app.use('/api', addApiRoutes())

configureHealthCheckRouter(app)

app.use(errorHandlerMiddleware)

server.listen(PORT || 4000, () => {
  console.log(`Server listening at PORT:${PORT || 4000}`)
  
  // Инициализация cron jobs для уведомлений о KPI задачах
  setupCronJobs()
})

// Graceful shutdown для Telegram бота и cron jobs
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  stopCronJobs()
  const bot = require('./modules/common/bot').default()
  if (bot && bot.stopPolling) {
    bot.stopPolling()
  }
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  stopCronJobs()
  const bot = require('./modules/common/bot').default()
  if (bot && bot.stopPolling) {
    bot.stopPolling()
  }
  process.exit(0)
})

export default app
