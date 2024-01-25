import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function myConstructorMillions(req: Request, res: Response) {
  try {
    const myConstructorMillions = await db.select('*').from('constructor_million')

    return res.status(200).json({ myConstructorMillions })
  } catch (error) {
    console.error('Error in my-constructor-millions.controller', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
