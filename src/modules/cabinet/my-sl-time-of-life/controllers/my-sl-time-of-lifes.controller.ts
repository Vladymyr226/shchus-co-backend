import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function mySlTimeOfLifes(req: Request, res: Response) {
  try {
    const mySlTimeOfLifes = await db.select('*').from('sl_time_of_life')

    return res.status(200).json({ mySlTimeOfLifes })
  } catch (error) {
    console.error('Error in my-sl-time-of-lifes.controller', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
