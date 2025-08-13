import { getPayments } from '../controllers/payments'
import { paymentStatusById } from '../controllers/paymentStatusById'
import { savePaymentObj } from '../controllers/savePaymentObj'
import { Router } from 'express'

export function createPaymentRouter() {
  const router = Router({ mergeParams: true })

  router.post('/liqpay/callback', savePaymentObj)
  router.post('/payment-status-by-id', paymentStatusById)
  router.get('/payments', getPayments)
  return router
}
