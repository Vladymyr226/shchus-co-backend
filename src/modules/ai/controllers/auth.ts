import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import db from '../../../db/knexKonfig'
import { generateToken } from '../../../utils/token.utils'
import { v4 as uuidv4 } from 'uuid'
import { redis } from '../../../db/redisConfig'
import nodemailer from 'nodemailer'
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function registration(req: Request, res: Response) {
  const { name, email, password } = req.query

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const hash = bcrypt.hashSync(password.toString(), bcrypt.genSaltSync(7))

  const userToDB = {
    name,
    email,
    password: hash,
  }

  try {
    const existingUser = await db('users-ai').where({ email }).first()
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }
    const newUser = await db('users-ai').insert(userToDB).returning('*')
    console.log(newUser)

    const token = generateToken(newUser[0].id)
    console.log('token-registration', token)

    return res.status(201).json({ token, user: newUser[0] })
  } catch (error) {
    console.error('Error in registration-controller', error)
    return res.status(400).json({ error })
  }
}

export async function login(req: Request, res: Response) {
  const { email, password, google_token } = req.query

  if (google_token) {
    const ticket = await client.verifyIdToken({
      idToken: (google_token || '').toString(),
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const { name, picture, sub, email: emailG } = payload || {}

    try {
      let user = await db.select().from('users-ai').where({ email: emailG })

      if (user[0]) {
        const currentUser = user[0]

        if (currentUser.name !== name || currentUser.avatar !== picture || currentUser.google_id !== sub) {
          user = await db('users-ai')
            .where({ email: emailG })
            .update({
              name,
              google_id: sub,
              avatar: picture,
              updated_at: db.fn.now(),
            })
            .returning('*')
        } else {
          user = [currentUser]
        }
      } else {
        user = await db('users-ai')
          .insert({
            name,
            email: emailG,
            google_id: sub,
            avatar: picture,
          })
          .returning('*')
      }

      const token = generateToken(user[0].id)
      console.log('token-registration', token)

      return res.status(201).json({ token, user: user[0] })
    } catch (error) {
      console.error('Error in notes.ts', error)
      return res.status(400).json({ error })
    }
  }
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    const user = await db.select().from('users-ai').where({ email })
    if (!user[0]) {
      return res.status(401).json({ message: 'The email you entered does not exist!' })
    }
    if (!bcrypt.compareSync(password.toString(), user[0].password)) {
      return res.status(401).json({ message: 'The password you provided is incorrect!' })
    }
    const token = generateToken(user[0].id)
    console.log('token-login ', token)
    return res.status(201).json({ token, user: user[0] })
  } catch (error) {
    console.error('Error in notes.ts', error)
    return res.status(400).json({ error })
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.query as { email?: string }
    const user = await db('users-ai').where({ email }).first()

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    const token = uuidv4()

    await redis.set(
      `reset-token:${token}`,
      JSON.stringify({
        user_id: user.id,
      }),
      'EX',
      180
    ) // 3min

    const resetUrl = `${process.env.ORIGIN_URL}/reset-password?token=${token}`

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password</p>
        <p>This link will expire in 3 minutes</p>
      `,
    })

    res.status(201).json({ status: true, resetUrl })
  } catch (error: any) {
    console.error('Error in forgot-password', error?.response)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, new_password, confirm_password } = req.query

    if (!token || !new_password || !confirm_password) {
      return res.status(401).json({ message: 'All fields are required' })
    }

    if (new_password !== confirm_password) {
      return res.status(401).json({ message: 'Passwords do not match' })
    }

    const tokenData = await redis.get(`reset-token:${token}`)
    if (!tokenData) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    const { user_id } = JSON.parse(tokenData)
    const user = await db('users-ai').where({ id: user_id }).first()
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    const hashedPassword = bcrypt.hashSync(new_password.toString(), bcrypt.genSaltSync(7))
    await db('users-ai').where({ id: user.id }).update({ password: hashedPassword })

    await redis.del(`reset-token:${token}`)

    res.status(201).json({ status: true })
  } catch (error) {
    console.error('Error in reset-password', error)
    res.status(500).json({ error: 'Server error' })
  }
}
