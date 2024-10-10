import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyShchusLifeHealth(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_shchus_life_health').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in health.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyShchusLifeHealth(req: Request, res: Response) {
  try {
    const getMyShchusLifeHealth = await db.select('*').from('my_shchus_life_health')

    return res.status(200).json({ getMyShchusLifeHealth })
  } catch (error) {
    console.error('Error in health.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyShchusLifeHealth(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_shchus_life_health').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in health.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
