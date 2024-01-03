import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function myArchiveHubs(req: Request, res: Response) {
  try {
    const archiveHubs = await db.select('*').from('archive_hub')

    return res.status(200).json({ archiveHubs })
  } catch (error) {
    console.error('Error in my-archive-hubs.controller.ts', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
