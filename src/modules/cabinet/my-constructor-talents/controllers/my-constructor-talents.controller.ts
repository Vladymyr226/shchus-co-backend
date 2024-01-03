import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function myConstructorTalents(req: Request, res: Response) {
  try {
    const myConstructorTalents = await db.select('*').from('constructor_talents')

    return res.status(200).json({ myConstructorTalents })
  } catch (error) {
    console.error('Error in my-constructor-talents.controller', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
