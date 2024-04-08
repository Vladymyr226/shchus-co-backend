import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'

export async function myDBS500ClubIdeas(req: Request, res: Response) {
  try {
    const myDBS500ClubIdeas = await db.select('*').from('dbs_500_club_idea')

    return res.status(200).json({ myDBS500ClubIdeas })
  } catch (error) {
    console.error('Error in ideas.controller', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function myDBS500ClubIdeaById(req: Request, res: Response) {
  const { id } = req.query

  try {
    const myDBS500ClubIdeaById = await db.select('*').from('dbs_500_club_idea').where('id', id)

    return res.status(200).json({ myDBS500ClubIdeaById })
  } catch (error) {
    console.error('Error in ideas.controller', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
