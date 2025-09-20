import crypto from 'crypto'
import db from '../../../db/knexKonfig'
import { verifyToken } from '../../../utils/token.utils'

const { LIQPAY_PRIVATE_KEY } = process.env

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
    const decodedToken = verifyToken(token) as { id?: string | number; userId?: string | number }
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
      // Перетворюємо час у часовий пояс України (Europe/Kyiv) та форматуємо у вигляді 'YYYY-MM-DD HH:mm:ss'
      order_time: new Date(decodedData.create_date)
        .toLocaleString('uk-UA', {
          timeZone: 'Europe/Kyiv',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        .replace(/(\d{2})\.(\d{2})\.(\d{4}), (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:$6'),
      order_id: decodedData.order_id,
      description: customDescriptionString,
      price: parseFloat(decodedData.amount),
      order_status: String(decodedData.status),
      payment: JSON.stringify(decodedData),
    }

    try {
      // Перевіряємо, чи не існує вже такий платіж
      const existingPayment = await db('subscriptions_ai')
        .where({ 
          order_id: decodedData.order_id
        })
        .first()

      if (existingPayment) {
        console.log('Payment already exists:', existingPayment)
        return res.status(200).json({ message: 'Payment already processed' })
      }

      // Зберігаємо платіж
      const payment = await db('subscriptions_ai').insert(paymentToDB).returning('*')
      console.log('Payment saved to DB:', payment)

      // Оновлюємо загальну суму користувача
      const paymentAmount = parseFloat(decodedData.amount)
      await db('users-ai')
        .where({ id: userId })
        .increment('total_amount', paymentAmount)

      console.log(`Updated user ${userId} total_amount by ${paymentAmount}`)
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
