import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { createAuthRouter } from './modules/auth/routes/users'
import cors from 'cors'
import { Router } from 'express'
import { createPaymentRouter } from './modules/payment/routes/payment'
import './configs/dotenv.config'
import { createCabinetRouter } from './modules/cabinet/shchus/routes/routes'
import { errorHandlerMiddleware } from './middleware/error.middleware'
import path from 'path'
import fs from 'fs'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
})

io.on('connection', (socket) => {
  console.log('A user connected')

  socket.on('CHAT_MESSAGE', ({ message }) => {
    console.log(message)
    io.emit('CHAT_UPDATE', { message })
  })

  socket.on('file-upload', ({ fileData, fileName }) => {
    const uniqueFileName = `${Date.now()}-${fileName}`
    const uploadDir = path.join(__dirname, 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir)
    }

    const filePath = path.join(uploadDir, uniqueFileName)

    fs.writeFile(filePath, fileData, 'base64', (err) => {
      if (err) {
        console.error('Ошибка при сохранении файла:', err)
        socket.emit('file-error', 'Ошибка при сохранении файла')
        return
      }
      console.log('Файл успешно сохранен:', filePath)

      const fileUrl = `http://localhost:${process.env.PORT || 4002}/uploads/${uniqueFileName}`

      socket.emit('file-download', fileUrl)
    })
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

function addApiRoutes() {
  const router = Router({ mergeParams: true })

  router.use('/auth', createAuthRouter())
  router.use('/cabinet', createCabinetRouter())
  router.use('/payment', createPaymentRouter())

  return router
}

app.use('/api', addApiRoutes())

app.get('/', (req: Request, res: Response) => {
  res.status(200).json('Health check works!')
})

app.use(errorHandlerMiddleware)

server.listen(process.env.PORT || 4002, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT || 4002}`)
})

export default app
