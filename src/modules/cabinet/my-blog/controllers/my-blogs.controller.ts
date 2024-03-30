import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function myBlogs(req: Request, res: Response) {
  try {
    const myBlogs = await db.select('*').from('blog')

    return res.status(200).json({ myBlogs })
  } catch (error) {
    console.error('Error in my-blogs.controller', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function myBlogById(req: Request, res: Response) {
  const { id } = req.query

  try {
    const blog = await db.select('*').from('blog').where('id', id)

    return res.status(200).json({ blog })
  } catch (error) {
    console.error('Error in my-blogs.controller', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function myBlogViewCount(req: Request, res: Response) {
  const { id } = req.query

  try {
    const blogCounts = await db('blog_viewcount')
      .count('id as count')
      .where('post_id', id)
      .groupBy('post_id')
      .orderBy('count', 'desc')
      .first()

    const maxCount = blogCounts ? blogCounts.count : 0

    return res.status(200).json({ maxCount })
  } catch (error) {
    console.error('Error in my-blogs.controller', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
