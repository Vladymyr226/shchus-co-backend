import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyIndustrialHubLifeResources(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_industrial_hub_life_resources')
      .insert({ data: json })
      .returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in my-life-resources.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyIndustrialHubLifeResources(req: Request, res: Response) {
  try {
    const getMyIndustrialHubLifeResources = await db
      .select('*')
      .from('my_industrial_hub_life_resources')

    return res.status(200).json({ getMyIndustrialHubLifeResources })
  } catch (error) {
    console.error('Error in my-life-resources.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyIndustrialHubLifeResources(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_industrial_hub_life_resources').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in my-life-resources.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
