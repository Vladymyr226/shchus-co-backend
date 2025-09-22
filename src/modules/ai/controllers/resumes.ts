import db from '../../../db/knexKonfig'
import { CREATED } from '../../../middleware/error.middleware'
import { Request, Response } from 'express'

export async function getResumes(req: Request, res: Response) {
  try {
    const getResumes = await db('resumes_ai').select('*')
    return res.status(200).json({ getResumes })
  } catch (error) {
    console.error('Error in resumes.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function createResume(req: Request, res: Response) {
  const { templateId, resumeData } = req.body

  try {
    const newItem = await db('resumes_ai').insert({ templateId, resumeData }).returning('*')
    console.log(newItem)
    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in resumes.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
