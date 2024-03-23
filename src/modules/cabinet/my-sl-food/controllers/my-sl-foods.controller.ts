import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function mySlFoods(req: Request, res: Response) {
  try {
    const mySlFoods = await db.select('*').from('sl_food')

    return res.status(200).json({ mySlFoods })
  } catch (error) {
    console.error('Error in my-sl-foods.controller', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
