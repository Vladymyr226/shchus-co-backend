import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function mySlBrains(req: Request, res: Response) {
  try {
    const mySlBrains = await db.select('*').from('sl_brain')

    return res.status(200).json({ mySlBrains })
  } catch (error) {
    console.error('Error in my-sl-brains.controller', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
