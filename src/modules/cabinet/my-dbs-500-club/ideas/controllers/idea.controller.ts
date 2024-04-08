import { Response } from 'express'
import db from '../../../../../db/knexKonfig'

export async function createMyDBS500ClubIdea(req, res: Response) {
  const { userId, lorem0, lorem1, lorem2, lorem3, lorem4, lorem5 } = req.body

  const linksArray = req.body.fileUrls

  const myDBS500ClubIdeaToDB = {
    user_id: userId as string,
    lorem_0: lorem0 as string,
    lorem_1: lorem1 as string,
    lorem_2: lorem2 as string,
    lorem_3: lorem3 as string,
    lorem_4: lorem4 as string,
    lorem_5: lorem5 as string,

    img_file0: linksArray[0] || '',
    img_file2: linksArray[1] || '',
  }

  try {
    const newItem = await db('dbs_500_club_idea').insert(myDBS500ClubIdeaToDB).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: 'OK' })
  } catch (error) {
    console.error('Error in idea.controller', error)
    return res.status(400).json({ message: error })
  }
}
