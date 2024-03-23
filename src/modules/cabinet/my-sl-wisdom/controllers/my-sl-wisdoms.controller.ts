import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function mySlWisdoms(req: Request, res: Response) {
  try {
    const mySlWisdoms = await db.select('*').from('sl_wisdom')

    return res.status(200).json({ mySlWisdoms })
  } catch (error) {
    console.error('Error in my-sl-wisdoms.controller', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
