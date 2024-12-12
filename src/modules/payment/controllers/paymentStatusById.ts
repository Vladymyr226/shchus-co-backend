import { Request, Response } from 'express'
import db from '../../../db/knexKonfig'

const paymentStatusById = async (req: Request, res: Response) => {
  const { userId, courseId } = req.query

  try {
    const payment = await db('subscriptions')
      .where({ user_id: userId, course_id: courseId })
      .orderBy('id', 'desc')
      .first()

    if (!payment) {
      const { userId, courseId } = req.query

      return res.status(200).json({
        message: `Payment not found for user ID: ${userId}, course ID: ${courseId}. Please check the payment details and try again.`,
      })
    }

    return res.status(200).json({ order_status: payment.order_status })
  } catch (error) {
    console.error('Error in paymentStatusById.ts', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export { paymentStatusById }
