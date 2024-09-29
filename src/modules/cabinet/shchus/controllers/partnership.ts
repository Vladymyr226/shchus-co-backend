import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../middleware/error.middleware'

export async function createMyPartnership(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_partnership').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in partnership.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyPartnership(req: Request, res: Response) {
  try {
    const getMyPartnership = await db.select('*').from('my_partnership')

    return res.status(200).json({ getMyPartnership })
  } catch (error) {
    console.error('Error in partnership.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyPartnership(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_partnership').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in partnership.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
