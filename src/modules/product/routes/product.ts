import { Router } from 'express'
import { bebra1, bebra2 } from '../controllers/products.controller'

export function createProductsRouter() {
  const router = Router({ mergeParams: true })

  router.get('/electrician/transformers/measuring/voltage/litye/performance/inductive', bebra1)
  router.get('/electrician/transformers/measuring/voltage/litye/performance/inductive-by', bebra2)

  return router
}
