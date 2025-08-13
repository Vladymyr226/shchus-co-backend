import crypto from 'crypto'

const { LIQPAY_PUBLIC_KEY, LIQPAY_PRIVATE_KEY, ORIGIN_URL, LIQPAY_CHECKOUT_URL } = process.env

export const getLinkForPayment = (req, res) => {
  const { description, plan, price } = req.query
  const user_id = req.user_id

  const formattedString = 
    `ID користувача: ${user_id}\n` +
    `Опис: ${description || 'Lorem ipsum dolor cum totam'}\n` +
    `План: ${plan || 'Pro'}`

  const paymentData = {
    public_key: LIQPAY_PUBLIC_KEY,
    version: 3,
    action: 'pay',
    amount: price || 19,
    currency: 'USD',
    description: formattedString,
    order_id: Date.now().toString(),
    result_url: `${ORIGIN_URL}/`,
  }

  console.log(paymentData)

  const jsonData = JSON.stringify(paymentData)
  const data = Buffer.from(jsonData).toString('base64')

  const signString = `${LIQPAY_PRIVATE_KEY}${data}${LIQPAY_PRIVATE_KEY}`

  const signature = Buffer.from(crypto.createHash('sha1').update(signString).digest()).toString('base64')

  res.send(`
      <h2 style="color: white;">Перенаправление на страницу оплаты...</h2>
      
      <form id="paymentForm" method="POST" action="${LIQPAY_CHECKOUT_URL}" accept-charset="utf-8" target="_blank">
        <input type="hidden" name="data" value="${data}"/>
        <input type="hidden" name="signature" value="${signature}"/>
        <input type="submit" value="Перейти к оплате" style="display: none;" id="submitBtn">
      </form>
      
      <div id="manualSubmit" style="margin-top: 20px;">
        <button onclick="document.getElementById('submitBtn').click()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Перейти к оплате
        </button>
      </div>
  `)
}