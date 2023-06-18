import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function constructorByName(req: Request, res: Response) {
  try {
    const productName = req.query.name
    const constructor = await db.select('*').from('сonstructors').where('product', productName)
    return res.status(200).json({ constructor: constructor[0] })
  } catch (error) {
    console.log('Error in constructors.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}
