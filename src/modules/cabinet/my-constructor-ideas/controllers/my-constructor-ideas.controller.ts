import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function myConstructorIdeas(req: Request, res: Response) {
  try {
    const myConstructorIdeas = await db.select('*').from('constructor_ideas')

    return res.status(200).json({ myConstructorIdeas })
  } catch (error) {
    console.error('Error in my-constructor-ideas.controller', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
