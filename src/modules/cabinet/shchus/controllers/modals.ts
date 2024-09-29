import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../middleware/error.middleware'

export async function createMyModal(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('modals').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED, modalId: newItem[0].id })
  } catch (error) {
    console.error('Error in modals.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function updateMyModalById(req: Request, res: Response) {
  const newJson = req.body
  const { userId } = req.query

  try {
    await db.table('modals').update({ data: newJson }).where('id', userId)

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in modals.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function getMyModalById(req: Request, res: Response) {
  const { userId } = req.query

  try {
    const getMyModalById = await db('modals').select('*').where('id', userId)

    return res.status(200).json({ getMyModalById })
  } catch (error) {
    console.error('Error in modals.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
