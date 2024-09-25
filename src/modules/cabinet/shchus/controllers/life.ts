import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../middleware/error.middleware'

export async function createMyLife(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_life').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in life.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyLife(req: Request, res: Response) {
  try {
    const getMyLife = await db.select('*').from('my_life')

    return res.status(200).json({ getMyLife })
  } catch (error) {
    console.error('Error in life.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyLife(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_life').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in life.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function createMyLifeModal(req, res: Response) {
  const { userId, isUndertake, isSubscribed } = req.query

  const objToDb = {
    user_id: userId,
    is_undertake: isUndertake,
    is_subscribed: isSubscribed,
  }

  try {
    const newItem = await db('my_life_modal').insert(objToDb).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED, newItem: newItem[0].id })
  } catch (error) {
    console.error('Error in life.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyLifeModal(req: Request, res: Response) {
  const { userId } = req.query
  try {
    const getMyLifeModal = await db.select('*').from('my_life_modal').where('id', userId)

    return res.status(200).json({ getMyLifeModal })
  } catch (error) {
    console.error('Error in life.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
