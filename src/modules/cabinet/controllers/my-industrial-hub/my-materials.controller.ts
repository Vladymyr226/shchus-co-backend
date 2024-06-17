import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../middleware/error.middleware'

export async function createMyIndustrialHubMaterials(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_industrial_hub_materials').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in my-materials.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyIndustrialHubMaterials(req: Request, res: Response) {
  try {
    const getMyIndustrialHubMaterials = await db.select('*').from('my_industrial_hub_materials')

    return res.status(200).json({ getMyIndustrialHubMaterials })
  } catch (error) {
    console.error('Error in my-materials.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyIndustrialHubMaterials(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_industrial_hub_materials').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in my-materials.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
