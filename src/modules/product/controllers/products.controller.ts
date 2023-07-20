import { Request, Response } from 'express'
import db from '../../../db/knexKonfig'

export async function bebra1(req: Request, res: Response) {
  try {
    const products = await db.select('*').from('cast_ind_transf_voltage')
    return res.status(200).json({ products })
  } catch (error) {
    console.error('Error in bebra1', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function bebra2(req: Request, res: Response) {
  const { id } = req.query

  try {
    const product = await db.select('*').from('cast_ind_transf_voltage').where('id', id)

    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }

    return res.status(200).json({ product: product[0] })
  } catch (error) {
    console.error('Error in bebra2', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
