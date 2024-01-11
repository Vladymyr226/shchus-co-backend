import { Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function createMyArchiveHub(req, res: Response) {
  const { lorem0, lorem1, lorem2 } = req.body
  const linksArray = req.body.fileUrls

  const archiveHubToDB = {
    lorem_0: lorem0 as string,
    lorem_1: lorem1 as string,
    lorem_2: lorem2 as string,

    img_file0: linksArray[0] || '',
    archive_file0: linksArray[1] || '',
  }

  try {
    const newItem = await db('archive_hub').insert(archiveHubToDB).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: 'OK' })
  } catch (error) {
    console.error('Error in my-archive-hub.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}
