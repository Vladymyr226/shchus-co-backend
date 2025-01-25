import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'
import { CREATED, DELETED, UPDATED } from '../../../../middleware/error.middleware'

export async function createMyProduct(req, res: Response) {
  const { title, description, price, type } = req.query
  const json = req.body

  try {
    const newItem = await db('products').insert({ title, description, price, type, data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED, newItem })
  } catch (error) {
    console.error('Error in products.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyProducts(req: Request, res: Response) {
  try {
    const getMyProducts = await db.select('*').from('products')

    return res.status(200).json({ getMyProducts })
  } catch (error) {
    console.error('Error in products.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyProduct(req: Request, res: Response) {
  const newJson = req.body
  const { id, title, description, price, type } = req.params

  try {
    await db.table('products').where({ id }).update({ title, description, price, type, data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in products.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function deleteMyProduct(req: Request, res: Response) {
  const { id } = req.params

  try {
    await db('products').where({ id }).del()

    return res.status(200).json({ message: DELETED })
  } catch (error) {
    console.error('Error in products.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function getMyProductById(req: Request, res: Response) {
  const { id } = req.query

  try {
    const getMyProductById = await db('products').select('*').where('id', id)

    return res.status(200).json({ getMyProductById })
  } catch (error) {
    console.error('Error in products.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
  }