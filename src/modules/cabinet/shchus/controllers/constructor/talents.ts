import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyConstructorTalents(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_constructor_talents').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in my constructor talents', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyConstructorTalents(req: Request, res: Response) {
  try {
    const getMyConstructorTalents = await db.select('*').from('my_constructor_talents')

    return res.status(200).json({ getMyConstructorTalents })
  } catch (error) {
    console.error('Error in my constructor talents', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyConstructorTalents(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_constructor_talents').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in my constructor talents', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
