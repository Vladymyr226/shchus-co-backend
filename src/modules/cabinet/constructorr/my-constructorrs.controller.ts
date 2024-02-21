import { Request, Response } from 'express'
import db from '../../../db/knexKonfig'

export async function myConstructorrs(req: Request, res: Response) {
  try {
    const constructorrs = await db.select('*').from('constructorr')

    return res.status(200).json({ constructorrs })
  } catch (error) {
    console.error('Error in my-constructorrs.controller.ts', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function myConstructorrById(req: Request, res: Response) {
  const { id } = req.query

  try {
    const constructorrById = await db
      .select('*')
      .from('constructorr_items')
      .where('constructorr_id', id)

    return res.status(200).json({ constructorrById })
  } catch (error) {
    console.error('Error in my-constructorrs.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
