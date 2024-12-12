import crypto from 'crypto'
import db from '../../../db/knexKonfig'

const privateKey = 'sandbox_AoHz8YjFcImThA6td4EHuzXk0csPArZzoaslqhdg'

export const savePaymentObj = async (req, res) => {
  const { data, signature } = req.body

  // Проверка подписи
  const signString = `${privateKey}${data}${privateKey}`
  const expectedSignature = crypto.createHash('sha1').update(signString).digest('base64')

  if (signature !== expectedSignature) {
    return res.status(400).send('Invalid signature')
  }

  // Декодирование и обработка данных
  const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
  console.log('Decoded data:', decodedData)

  const customDescriptionString = decodedData.description
  // Регулярное выражение для извлечения данных
  const regex = /Описание: (.*?), ID пользователя: (\d+), ID курса: (\d+)/
  const matches = customDescriptionString.match(regex)

  const description = matches[1]
  const userId = matches[2]
  const courseId = matches[3]

  // Обработка данных о платеже
  if (decodedData.status === 'success') {
    const paymentToDB = {
      user_id: parseInt(userId, 10),
      course_id: parseInt(courseId, 10),
      order_time: new Date(decodedData.create_date),
      order_id: decodedData.order_id,
      description: String(description),
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
