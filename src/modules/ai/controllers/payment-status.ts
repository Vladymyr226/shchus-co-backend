import { Request, Response } from 'express'
import db from '../../../db/knexKonfig'

const paymentStatusById = async (req: Request, res: Response) => {
  const { userId } = req.query

  try {
    const payment = await db('subscriptions_ai').where({ user_id: userId }).orderBy('id', 'desc').first()

    if (!payment) {
      return res.status(200).json({
        message: `Payment not found for user ID: ${userId}. Please check the payment details and try again.`,
      })
    }

    return res.status(200).json({
      order_status: payment.order_status,
      price: payment.price,
    })
  } catch (error) {
    console.error('Error in paymentStatusById.ts', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export { paymentStatusById }
