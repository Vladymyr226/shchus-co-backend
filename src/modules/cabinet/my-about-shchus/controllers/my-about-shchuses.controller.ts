import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function myAboutShchuses(req: Request, res: Response) {
  try {
    const myAboutShchuses = await db.select('*').from('about_shchus')

    return res.status(200).json({ myAboutShchuses })
  } catch (error) {
    console.error('Error in my-about-shchuses.controller.ts', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
