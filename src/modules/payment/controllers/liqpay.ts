import crypto from 'crypto'

const publicKey = 'sandbox_i75277326466'
const privateKey = 'sandbox_AoHz8YjFcImThA6td4EHuzXk0csPArZzoaslqhdg'

export const liqpay = (req, res) => {
  const { userId, courseId, description, price } = req.query

  const formattedString = `Описание: ${description}, ID пользователя: ${userId}, ID курса: ${courseId}`

  const paymentData = {
    public_key: publicKey,
    version: 3,
    action: 'pay',
    amount: price,
    currency: 'USD',
    description: formattedString,
    order_id: Date.now().toString(),
    result_url: `https://www.it-tutor.ai/course-details/?id=${courseId}`,
  }

  const jsonData = JSON.stringify(paymentData)
  const data = Buffer.from(jsonData).toString('base64')

  const signString = `${privateKey}${data}${privateKey}`

  const signature = Buffer.from(crypto.createHash('sha1').update(signString).digest()).toString(
    'base64'
  )

  res.send(`
    <form method="POST" action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8">
      <input type="hidden" name="data" value="${data}"/>
      <input type="hidden" name="signature" value="${signature}"/>
      <input type="image" src="//static.liqpay.ua/buttons/payUk.png"/>
    </form>
  `)
}
