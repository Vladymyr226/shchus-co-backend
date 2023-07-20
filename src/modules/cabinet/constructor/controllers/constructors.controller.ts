import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function constructorByName(req: Request, res: Response) {
  try {
    const productName = req.query.name

    const constructor = await db.select('*').from('сonstructors').where('product', productName)

    if (constructor.length === 0) {
      return res.status(404).json({ message: 'Constructor not found' })
    }

    return res.status(200).json({ constructor: constructor[0] })
  } catch (error) {
    console.error('Error in constructors.controller.ts', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
