import { Request, Response } from 'express'
import db from '../../../db/knexKonfig'

export async function bebra1(req: Request, res: Response) {
  try {
    const products = await db.select('*').from('cast_ind_transf_voltage')
    return res.status(200).json({ products })
  } catch (error) {
    console.log('Error in bebra1', error)
    return res.status(400).json({ message: error })
  }
}

export async function bebra2(req: Request, res: Response) {
  const { id } = req.query

  try {
    const product = await db.select('*').from('cast_ind_transf_voltage').where('id', id)
    return res.status(200).json({ product: product[0] })
  } catch (error) {
    console.log('Error in bebra2', error)
    return res.status(400).json({ message: error })
  }
}
