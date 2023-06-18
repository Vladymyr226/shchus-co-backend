import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import db from '../../../db/knexKonfig'
import { generateToken } from '../../../utils/token.utils'

export async function registration(req: Request, res: Response) {
  const { name, surname, email, password } = req.query

  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(7))

  const userToDB = {
    first_name: name,
    last_name: surname,
    email,
    password: hash,
  }

  try {
    const newUser = await db('users').insert(userToDB).returning('*')
    console.log(newUser)
    const token = generateToken(newUser[0].id)
    console.log('token-registration', token)
    return res.status(201).json({ token, user: newUser[0] })
  } catch (error) {
    console.log('Error in registration-controller', error)
    return res.status(400).json({ message: error })
  }
}

export async function login(req, res) {
  const { email, password } = req.query

  try {
    const user = await db.select().from('users').where('email', '=', email)
    if (!user[0]) {
      return res.status(401).json({ message: 'The email you entered does not exist!' })
    }
    if (!bcrypt.compareSync(password, user[0].password)) {
      return res.status(401).json({ message: 'The password you provided is incorrect!' })
    }
    const token = generateToken(user[0].id)
    console.log('token-login ', token)
    return res.status(200).json({ token, user: user[0] })
  } catch (error) {
    console.log('Error in login-controller', error)
    return res.status(400).json({ message: error })
  }
}
