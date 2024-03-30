import { Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function createMyBlog(req, res: Response) {
  const { lorem0, lorem1, lorem2, lorem3, lorem4, lorem5, lorem6, lorem7, lorem8 } = req.body

  const linksArray = req.body.fileUrls

  const myBlogToDB = {
    lorem_0: lorem0 as string,
    lorem_1: lorem1 as string,
    lorem_2: lorem2 as string,
    lorem_3: lorem3 as string,
    lorem_4: lorem4 as string,
    lorem_5: lorem5 as string,
    lorem_6: lorem6 as string,
    lorem_7: lorem7 as string,
    lorem_8: lorem8 as string,

    img_file0: linksArray[0] || '',
    img_file2: linksArray[1] || '',
    img_file3: linksArray[2] || '',
    img_file4: linksArray[3] || '',
    video_file0: linksArray[4] || '',
    video_file1: linksArray[5] || '',
    video_file2: linksArray[6] || '',
    video_file3: linksArray[7] || '',
  }

  try {
    const newItem = await db('blog').insert(myBlogToDB).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: 'OK' })
  } catch (error) {
    console.error('Error in my-blog.controller', error)
    return res.status(400).json({ message: error })
  }
}

export async function createMyBlogViewCount(req, res: Response) {
  const { id } = req.body

  const myBlogViewCountToDB = {
    post_id: id as string,
  }

  try {
    const newItem = await db('blog_viewcount').insert(myBlogViewCountToDB).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: 'OK' })
  } catch (error) {
    console.error('Error in my-blog.controller', error)
    return res.status(400).json({ message: error })
  }
}
