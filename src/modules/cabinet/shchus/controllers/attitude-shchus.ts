import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../middleware/error.middleware'

export async function createMyAttitudeShchus(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_attitude_shchus').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in attitude-shchus.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyAttitudeShchus(req: Request, res: Response) {
  try {
    const getMyAttitudeShchus = await db.select('*').from('my_attitude_shchus')

    return res.status(200).json({ getMyAttitudeShchus })
  } catch (error) {
    console.error('Error in attitude-shchus.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyAttitudeShchus(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_attitude_shchus').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in attitude-shchus.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
