import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyShchusLifeEnergy(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_shchus_life_energy').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in energy.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyShchusLifeEnergy(req: Request, res: Response) {
  try {
    const getMyShchusLifeEnergy = await db.select('*').from('my_shchus_life_energy')

    return res.status(200).json({ getMyShchusLifeEnergy })
  } catch (error) {
    console.error('Error in energy.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyShchusLifeEnergy(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_shchus_life_energy').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in energy.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
