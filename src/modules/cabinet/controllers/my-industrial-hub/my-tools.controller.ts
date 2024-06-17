import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../middleware/error.middleware'

export async function createMyIndustrialHubTools(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_industrial_hub_tools').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in my-tools.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyIndustrialHubTools(req: Request, res: Response) {
  try {
    const getMyIndustrialHubTools = await db.select('*').from('my_industrial_hub_tools')

    return res.status(200).json({ getMyIndustrialHubTools })
  } catch (error) {
    console.error('Error in my-tools.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyIndustrialHubTools(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_industrial_hub_tools').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in my-tools.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
