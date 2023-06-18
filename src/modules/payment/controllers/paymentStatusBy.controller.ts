import { Request, Response } from 'express'
import db from '../../../db/knexKonfig'

const paymentStatusBy = async (req: Request, res: Response) => {
  const { id } = req.query

  try {
    const payment = await db('subscriptions').where('user_id', id).orderBy('id', 'desc').first()
    return res.status(200).json({ payment })
  } catch (error) {
    console.log('Error in paymentStatusBy.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}

export { paymentStatusBy }
