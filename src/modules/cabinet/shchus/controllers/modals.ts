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

export async function getMyModalsById(req: Request, res: Response) {
  const { idArr } = req.query

  const tmp: any = idArr

  // Преобразуем строку в массив, если необходимо
  const ids = Array.isArray(tmp) ? tmp : tmp.split(',').map((id) => id.trim())

  try {
    const getMyModalsById = await db.select('*').from('modals').whereIn('id', ids)

    if (getMyModalsById.length === 0) {
      return res.status(404).json({ message: 'No modals found for the provided IDs' })
    }

    return res.status(200).json(getMyModalsById)
  } catch (error) {
    console.error('Error in modals.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
