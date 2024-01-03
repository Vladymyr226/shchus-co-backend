import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { createAuthRouter } from './modules/auth/routes/users'
import cors from 'cors'
import { Router } from 'express'
import { createPaymentRouter } from './modules/payment/routes/payment'
import { errorHandlerMiddleware } from './middleware/error.middleware'
import './configs/dotenv.config'
import { createCabinetRouter } from './modules/cabinet/products/routes/routes'
import { createProductsRouter } from './modules/product/routes/product'
import multer from 'multer'
const winston = require('winston')
const { createLogger, transports, format } = winston

const app = express()

// Создаем транспорт, который записывает журналы в файл
// const fileTransport = new transports.File({
//   filename: 'server.log',
// })

// Создаем логгер и добавляем к нему транспорт файлового журнала
// const logger = createLogger({
//   level: 'info',
//   format: format.combine(format.timestamp(), format.json()),
//   transports: [fileTransport],
// })

// Middleware для записи запросов в журнал
// app.use((req, res, next) => {
//   logger.info({
//     method: req.method,
//     path: req.path,
//     ip: req.ip,
//     headers: req.headers,
//   })
//   next()
// })

// app.use((err, req, res, next) => {
//   logger.error({
//     message: err.message,
//     stack: err.stack,
//   })
//   res.status(500).send('Something went wrong')
// })

app.use(express.json())

app.use(
  cors({
    origin: [
      /www.shchus.co/,
      /shchus.co/,
      /shchus-co.vercel.app/,
      /http:\/\/localhost.*/,
      /http:\/\/172.*/,
      /http:\/\/192.*/,
      /http:\/\/54.154.216.60/,
    ],
    credentials: true,
  })
)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function addApiCoRoutes() {
  const router = Router({ mergeParams: true })

  router.use('/auth', createAuthRouter())
  router.use('/cabinet', createCabinetRouter())
  router.use('/products', createProductsRouter())
  router.use('/payment', createPaymentRouter())

  return router
}

app.use('/api', addApiCoRoutes())

app.get('/', (req: Request, res: Response) => {
  res.status(200).json('Health check works!')
})

app.use(errorHandlerMiddleware)

app.use((error: any, req: Request, res: Response) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large' })
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files' })
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'File must be an image/mp4/pdf type' })
    }
  }
})

app.listen(process.env.PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}`)
})

export default app
