import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyShchusLifeWisdom(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_shchus_life_wisdom').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in wisdom.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyShchusLifeWisdom(req: Request, res: Response) {
  try {
    const getMyShchusLifeWisdom = await db.select('*').from('my_shchus_life_wisdom')

    return res.status(200).json({ getMyShchusLifeWisdom })
  } catch (error) {
    console.error('Error in wisdom.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyShchusLifeWisdom(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_shchus_life_wisdom').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in wisdom.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
