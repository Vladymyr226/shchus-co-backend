import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function myDBS500Clubs(req: Request, res: Response) {
  try {
    const myDBS500Clubs = await db.select('*').from('dbs_500_club')

    return res.status(200).json({ myDBS500Clubs })
  } catch (error) {
    console.error('Error in my-dbs-500-clubs.controller', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
