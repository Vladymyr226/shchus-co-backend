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

export async function myArchiveHubById(req: Request, res: Response) {
  const { id } = req.query

  try {
    const archiveHub = await db.select('*').from('archive_hub').where('id', id)

    return res.status(200).json({ archiveHub })
  } catch (error) {
    console.error('Error in my-archive-hubs.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
