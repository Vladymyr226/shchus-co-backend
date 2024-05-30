import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { createAuthRouter } from './modules/auth/routes/users'
import cors from 'cors'
import { Router } from 'express'
import { createPaymentRouter } from './modules/payment/routes/payment'
import { errorHandlerMiddleware } from './middleware/error.middleware'
import { createCabinetRouter } from './modules/cabinet/products/routes/routes'
import { createProductsRouter } from './modules/product/routes/product'
import './configs/dotenv.config'
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')
const fs = require('fs')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('../swagger.js')

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
})

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('CHAT_MESSAGE', ({ message }) => {
    console.log(message)
    io.emit('CHAT_UPDATE', { message })
  })

  socket.on('file-upload', ({ fileData, fileName }) => {
    const uniqueFileName = fileName

    console.log(__dirname)
    const filePath = path.join(__dirname, 'uploads', uniqueFileName)

    fs.writeFile(filePath, fileData, 'base64', (err) => {
      if (err) {
        console.error('Ошибка при сохранении файла:', err)
        return
      }
      console.log('Файл успешно сохранен:', filePath)

      // const fileUrl = `http://localhost:4000/src/uploads/${uniqueFileName}`
      const fileUrl = `http://localhost:4000/src/uploads/bmw.jpg`

      socket.emit('file-download', fileUrl)
    })
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

app.use(express.json())

app.use(
  cors()
  // {
  //   origin: [
  //     /www.shchus.co/,
  //     /shchus.co/,
  //     /shchus-co.vercel.app/,
  //     /cb-shchus.vercel.app/,
  //     /http:\/\/localhost.*/,
  //     /http:\/\/172.*/,
  //     /http:\/\/192.*/,
  //     /http:\/\/54.154.216.60/,
  //   ],
  //   credentials: true,
  // }
)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function addApiRoutes() {
  const router = Router({ mergeParams: true })

  router.use('/auth', createAuthRouter())
  router.use('/cabinet', createCabinetRouter())
  router.use('/products', createProductsRouter())
  router.use('/payment', createPaymentRouter())

  return router
}

app.use('/api', addApiRoutes())

app.get('/', (req: Request, res: Response) => {
  res.status(200).json('Health check works!')
})

// app.use(errorHandlerMiddleware)

// Настройка маршрута для Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

server.listen(4001, () => {
  console.log(`Server listening at http://localhost:4001`)
})

app.listen(process.env.PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}`)
  console.log(`Swagger UI available at http://localhost:${process.env.PORT}/api-docs`)
})

export default app
