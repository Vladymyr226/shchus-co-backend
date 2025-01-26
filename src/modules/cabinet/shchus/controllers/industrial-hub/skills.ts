import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyIndustrialHubSkills(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_industrial_hub_skills').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in my-skills.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyIndustrialHubSkills(req: Request, res: Response) {
  try {
    const getMyIndustrialHubSkills = await db.select('*').from('my_industrial_hub_skills')

    return res.status(200).json({ getMyIndustrialHubSkills })
  } catch (error) {
    console.error('Error in my-skills.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyIndustrialHubSkills(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_industrial_hub_skills').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in my-skills.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
