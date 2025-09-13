import { paymentStatusById } from '../controllers/paymentStatusById'
import { Router } from 'express'

export function createPaymentRouter() {
  const router = Router({ mergeParams: true })

  router.post('/payment-status-by-id', paymentStatusById)

  return router
}
