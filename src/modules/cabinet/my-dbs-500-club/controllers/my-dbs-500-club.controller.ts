import { Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function createMyDBS500Club(req, res: Response) {
  const { lorem0 } = req.body

  const linksArray = req.body.fileUrls

  const myDBS500ClubToDB = {
    lorem_0: lorem0 as string,
    img_file0: linksArray[0] || '',
  }

  try {
    const newItem = await db('dbs_500_club').insert(myDBS500ClubToDB).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: 'OK' })
  } catch (error) {
    console.error('Error in my-blog.controller', error)
    return res.status(400).json({ message: error })
  }
}
