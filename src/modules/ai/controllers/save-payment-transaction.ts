import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import db from '../../../db/knexKonfig'

const { LIQPAY_PRIVATE_KEY, SECRET } = process.env

export const savePaymentTransaction = async (req, res) => {
  const { data, signature } = req.body

  // Проверка подписи
  const signString = `${LIQPAY_PRIVATE_KEY}${data}${LIQPAY_PRIVATE_KEY}`
  const expectedSignature = crypto.createHash('sha1').update(signString).digest('base64')

  if (signature !== expectedSignature) {
    return res.status(400).send('Invalid signature')
  }

  // Декодирование и обработка данных
  const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
  console.log('Decoded data:', decodedData)

  const customDescriptionString = decodedData.description

  // Регулярное выражение для извлечения токена из описания "AI ${token}"
  const regex = /^AI (.+)$/
  const matches = customDescriptionString.match(regex)

  if (!matches) {
    return res.status(400).send('Invalid description format')
  }

  const token = matches[1]

  // Декодируем JWT токен для получения user_id
  let userId
  try {
    // Перевіряємо, що секрет для JWT визначений
    if (!SECRET) {
      console.error('JWT_SECRET не визначено у змінних середовища')
      return res.status(500).send('JWT secret is not configured')
    }

    const decodedToken = jwt.verify(token, SECRET as string) as { id?: string | number; userId?: string | number }
    userId = decodedToken.id || decodedToken.userId
  } catch (error) {
    console.error('Помилка декодування токена:', error)
    return res.status(400).send('Invalid token')
  }

  // Обработка данных о платеже
  if (decodedData.status === 'success') {
    console.log('Payment was successful:', decodedData.status)
    console.log('Payment data:', decodedData)

    const paymentToDB = {
      user_id: parseInt(userId, 10),
      order_time: new Date(decodedData.create_date),
      order_id: decodedData.order_id,
      description: customDescriptionString,
      price: parseInt(decodedData.amount, 10),
      order_status: String(decodedData.status),
      payment: JSON.stringify(decodedData),
    }

    try {
      const payment = await db('subscriptions').insert(paymentToDB).returning('*')
      console.log('Payment saved to DB:', payment)
      return res.status(201).json({ message: 'Payment saved successfully' })
    } catch (error) {
      console.error('Error saving payment to DB:', error)
      return res.status(500).json({ message: 'Error saving payment data' })
    }
  } else {
    console.log('Payment was not successful:', decodedData.status)
    return res.status(200).send('Payment not successful')
  }
}
