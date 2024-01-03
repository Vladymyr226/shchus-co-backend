import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function myConstructorDesigners(req: Request, res: Response) {
  try {
    const myConstructorDesigners = await db.select('*').from('constructor_designer')

    return res.status(200).json({ myConstructorDesigners })
  } catch (error) {
    console.error('Error in my-constructor-designers.controller', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
