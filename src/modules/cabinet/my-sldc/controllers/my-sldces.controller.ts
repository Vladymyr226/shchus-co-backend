import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function mySldces(req: Request, res: Response) {
  try {
    const mySldces = await db.select('*').from('sldc')

    return res.status(200).json({ mySldces })
  } catch (error) {
    console.error('Error in my-sldces.controller', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
