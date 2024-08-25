import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyIndustrialHubFuture(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_industrial_hub_future').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in my-future.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyIndustrialHubFuture(req: Request, res: Response) {
  try {
    const getMyIndustrialHubFuture = await db.select('*').from('my_industrial_hub_future')

    return res.status(200).json({ getMyIndustrialHubFuture })
  } catch (error) {
    console.error('Error in my-future.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyIndustrialHubFuture(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_industrial_hub_future').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in my-future.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
