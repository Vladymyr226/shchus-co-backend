import { Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function createMyConstructorDesigner(req, res: Response) {
  const { lorem0, lorem1, lorem2, lorem3, lorem4, selectedOption, lorem5, lorem6, lorem7, lorem8 } =
    req.body

  const linksArray = req.body.fileUrls

  const myConstructorDesignerToDB = {
    lorem_0: lorem0 as string,
    lorem_1: lorem1 as string,
    lorem_2: lorem2 as string,
    lorem_3: lorem3 as string,
    lorem_4: lorem4 as string,
    selected_option: selectedOption as string,
    lorem_5: lorem5 as string,
    lorem_6: lorem6 as string,
    lorem_7: lorem7 as string,
    lorem_8: lorem8 as string,

    video_file0: linksArray[0] || '',
    img_file0: linksArray[1] || '',
    img_file2: linksArray[2] || '',
    video_file1: linksArray[3] || '',
    archive_file0: linksArray[4] || '',
  }

  try {
    const newItem = await db('constructor_designer')
      .insert(myConstructorDesignerToDB)
      .returning('*')
    console.log(newItem)

    return res.status(201).json({ message: 'OK' })
  } catch (error) {
    console.error('Error in my-constructor-designer.controller', error)
    return res.status(400).json({ message: error })
  }
}
