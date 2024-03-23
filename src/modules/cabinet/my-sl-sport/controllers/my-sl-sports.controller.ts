import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function mySlSports(req: Request, res: Response) {
  try {
    const mySlSports = await db.select('*').from('sl_sport')

    return res.status(200).json({ mySlSports })
  } catch (error) {
    console.error('Error in my-sl-sports.controller', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
