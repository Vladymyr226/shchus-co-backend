import { Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function createMyAboutShchus(req, res: Response) {
  const { lorem0, lorem1, lorem2 } = req.body
  const linksArray = req.body.fileUrls

  const MyAboutShchusToDB = {
    lorem_0: lorem0 as string,
    lorem_1: lorem1 as string,
    lorem_2: lorem2 as string,

    img_file0: linksArray[0] || '',
    img_file2: linksArray[1] || '',
    img_file3: linksArray[2] || '',
    img_file4: linksArray[3] || '',
    img_file5: linksArray[4] || '',
    pdf_file: linksArray[5] || '',
  }

  try {
    const newItem = await db('about_shchus').insert(MyAboutShchusToDB).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: 'OK' })
  } catch (error) {
    console.error('Error in my-about-shchus.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}
