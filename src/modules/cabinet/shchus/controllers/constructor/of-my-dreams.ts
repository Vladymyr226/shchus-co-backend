import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyConstructorOfMyDreams(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_constructor_of_my_dreams').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in my constructor of my dreams', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyConstructorOfMyDreams(req: Request, res: Response) {
  try {
    const getMyConstructorOfMyDreams = await db.select('*').from('my_constructor_of_my_dreams')

    return res.status(200).json({ getMyConstructorOfMyDreams })
  } catch (error) {
    console.error('Error in my constructor of my dreams', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyConstructorOfMyDreams(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_constructor_of_my_dreams').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in my constructor of my dreams', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
