import { Router } from 'express'
import { userSchema } from '../validation/user.schema'
import { validateSchema } from '../../../middleware/validate.schema'
import { registration, login, getUserInfoById } from '../controllers/user'

export function createAuthRouter() {
  const router = Router({ mergeParams: true })

  router.post('/register', validateSchema(userSchema), registration)

  router.post('/login', login)

  router.get('/user-info', getUserInfoById)

  return router
}
