import { Router } from 'express'
import { userSchema } from '../validation/user.schema'
import { validateSchema } from '../../../middleware/validate.schema'
// import { verifyToken } from '../../../middleware/verifyToken.js'
import { registration, login } from '../controllers/users.controller'

export function createAuthRouter() {
  const router = Router({ mergeParams: true })

  router.post('/register', validateSchema(userSchema), registration)
  router.post('/login', login)

  return router
}
