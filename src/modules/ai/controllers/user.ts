import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import db from '../../../db/knexKonfig'
import { generateToken } from '../../../utils/token.utils'

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
    const existingUser = await db('users-ai').where({email}).first()
    if (existingUser) {
      return res.status(200).json({ message: 'User with this email already exists' })
    }
    const newUser = await db('users-ai').insert(userToDB).returning('*')
    console.log(newUser)

    const token = generateToken(newUser[0].id)
    console.log('token-registration', token)

    return res.status(201).json({ token, user: newUser[0] })
  } catch (error) {
    console.error('Error in registration-controller', error)
    return res.status(400).json({ message: error })
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.query

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    const user = await db.select().from('users-ai').where({email})
    if (!user[0]) {
      return res.status(200).json({ message: 'The email you entered does not exist!' })
    }
    if (!bcrypt.compareSync(password.toString(), user[0].password)) {
      return res.status(200).json({ message: 'The password you provided is incorrect!' })
    }
    const token = generateToken(user[0].id)
    console.log('token-login ', token)
    return res.status(201).json({ token, user: user[0] })
  } catch (error) {
    console.error('Error in user.ts', error)
    return res.status(400).json({ message: error })
  }
}
