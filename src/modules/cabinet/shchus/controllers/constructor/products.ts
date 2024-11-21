import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyConstructorProducts(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_constructor_products').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in my constructor products', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyConstructorProducts(req: Request, res: Response) {
  try {
    const getMyConstructorProducts = await db.select('*').from('my_constructor_products')

    return res.status(200).json({ getMyConstructorProducts })
  } catch (error) {
    console.error('Error in my constructor products', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyConstructorProducts(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_constructor_products').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in my constructor products', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
