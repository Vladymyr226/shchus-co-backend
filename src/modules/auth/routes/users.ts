// routes/auth.js
import { Router } from 'express'
import { userSchema } from '../validation/user.schema'
import { validateSchema } from '../../../middleware/validate.schema'
import { registration, login } from '../controllers/users.controller'

export function createAuthRouter() {
  const router = Router({ mergeParams: true })

  /**
   * @swagger
   * tags:
   *   name: Auth
   *   description: Authentication and registration
   */

  /**
   * @swagger
   * /register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: User registered successfully
   *       400:
   *         description: Bad request
   */
  router.post('/register', validateSchema(userSchema), registration)

  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Login a user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *             required:
   *               - email
   *               - password
   *     responses:
   *       200:
   *         description: User logged in successfully
   *       400:
   *         description: Bad request
   */
  router.post('/login', login)

  return router
}
