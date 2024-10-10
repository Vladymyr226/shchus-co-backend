import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyShchusLifeBrain(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_shchus_life_brain').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in brain.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyShchusLifeBrain(req: Request, res: Response) {
  try {
    const getMyShchusLifeBrain = await db.select('*').from('my_shchus_life_brain')

    return res.status(200).json({ getMyShchusLifeBrain })
  } catch (error) {
    console.error('Error in brain.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyShchusLifeBrain(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_shchus_life_brain').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in brain.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
