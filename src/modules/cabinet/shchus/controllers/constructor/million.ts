import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyConstructorMillion(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_constructor_million').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in my constructor million', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyConstructorMillion(req: Request, res: Response) {
  try {
    const getMyConstructorMillion = await db.select('*').from('my_constructor_million')

    return res.status(200).json({ getMyConstructorMillion })
  } catch (error) {
    console.error('Error in my constructor million', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyConstructorMillion(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_constructor_million').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in my constructor million', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
