import crypto from 'crypto'

const publicKey = 'sandbox_i87012785458'
const privateKey = 'sandbox_deAgn2ZkW8zDyqa40tqICXMxtAJ9pSJoAl0a5b8g'

export const getLinkForPayment = (req, res) => {
  const { userId, description, plan, price } = req.query

  const formattedString = 
    `ID користувача: ${userId || 1}\n` +
    `Опис: ${description || 'Lorem ipsum dolor cum totam'}\n` +
    `План: ${plan || 'Pro'}`

  const paymentData = {
    public_key: publicKey,  
    version: 3,
    action: 'pay',
    amount: price || 19,
    currency: 'USD',
    description: formattedString,
    order_id: Date.now().toString(),
    result_url: 'https://vision-of-life-ai.vercel.app/',
  }

  console.log(paymentData)

  const jsonData = JSON.stringify(paymentData)
  const data = Buffer.from(jsonData).toString('base64')

  const signString = `${privateKey}${data}${privateKey}`

  const signature = Buffer.from(crypto.createHash('sha1').update(signString).digest()).toString('base64')

  res.send(`
    <form method="POST" action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8">
      <input type="hidden" name="data" value="${data}"/>
      <input type="hidden" name="signature" value="${signature}"/>
      <input type="image" src="//static.liqpay.ua/buttons/payUk.png"/>
    </form>
  `)
}