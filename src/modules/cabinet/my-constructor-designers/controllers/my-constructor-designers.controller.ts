import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function myConstructorDesigners(req: Request, res: Response) {
  try {
    const myConstructorDesigners = await db.select('*').from('constructor_designer')

    return res.status(200).json({ myConstructorDesigners })
  } catch (error) {
    console.error('Error in my-constructor-designers.controller', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function myConstructorDesignerById(req: Request, res: Response) {
  const { id } = req.query

  try {
    const myConstructorDesignerById = await db
      .select('*')
      .from('constructor_designer_items')
      .where('constructor_designer_id', id)

    return res.status(200).json({ myConstructorDesignerById })
  } catch (error) {
    console.error('Error in my-constructor-designers.controller', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
