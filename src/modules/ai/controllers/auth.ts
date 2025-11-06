import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import db from '../../../db/knexKonfig'
import { generateToken, generateResetPasswordToken, verifyResetPasswordToken } from '../../../utils/token.utils'
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

    // Генерируем JWT токен с сроком действия 3 минуты
    const token = generateResetPasswordToken(user.id)

    const resetUrl = `${process.env.ORIGIN_URL}/reset-password?token=${token}`

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Password Reset Request</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                        Hello,
                      </p>
                      <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                        We received a request to reset your password. Click the button below to create a new password:
                      </p>
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                          <td align="center" style="padding: 0;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        Or copy and paste this link into your browser:
                      </p>
                      <p style="margin: 10px 0 0 0; color: #667eea; font-size: 14px; word-break: break-all; line-height: 1.6;">
                        ${resetUrl}
                      </p>
                      <div style="margin: 30px 0; padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                          <strong>⚠️ Important:</strong> This link will expire in <strong>3 minutes</strong> for security reasons.
                        </p>
                      </div>
                      <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.6;">
                        This is an automated message, please do not reply to this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
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

    // Верифицируем JWT токен
    const tokenData = verifyResetPasswordToken(token.toString())
    if (!tokenData) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    const user = await db('users-ai').where({ id: tokenData.userId }).first()
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    const hashedPassword = bcrypt.hashSync(new_password.toString(), bcrypt.genSaltSync(7))
    await db('users-ai').where({ id: user.id }).update({ password: hashedPassword })

    res.status(201).json({ status: true })
  } catch (error) {
    console.error('Error in reset-password', error)
    res.status(500).json({ error: 'Server error' })
  }
}
