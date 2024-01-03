import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function myAboutBureaus(req: Request, res: Response) {
  try {
    const myAboutBureaus = await db.select('*').from('about_bureau')

    return res.status(200).json({ myAboutBureaus })
  } catch (error) {
    console.error('Error in my-about-bureaus.controller.ts', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
