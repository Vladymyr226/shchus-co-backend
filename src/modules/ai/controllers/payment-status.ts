import { Request, Response } from 'express'
import db from '../../../db/knexKonfig'
import { ExpressRequest } from '../middlewares/user.auth'

const paymentStatusById = async (req: ExpressRequest, res: Response) => {
  const userId = req.user_id

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

const deductAmount = async (req: ExpressRequest, res: Response) => {
  const { amount } = req.query
  const userId = req.user_id

  try {
    // Перевіряємо, що сума передана
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' })
    }

    // Знаходимо активну підписку користувача
    const subscription = await db('subscriptions_ai')
      .where({ user_id: userId, order_status: 'success' })
      .orderBy('id', 'desc')
      .first()

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' })
    }

    // Перевіряємо, чи достатньо коштів
    if (subscription.price < amount) {
      return res.status(400).json({ 
        message: 'Insufficient funds',
        current_balance: subscription.price,
        requested_amount: amount
      })
    }

    // Списуємо суму
    const newBalance = subscription.price - amount
    await db('subscriptions_ai')
      .where({ id: subscription.id })
      .update({ 
        price: newBalance,
        updated_at: db.fn.now()
      })

    return res.status(200).json({
      message: 'Amount deducted successfully',
      previous_balance: subscription.price,
      deducted_amount: amount,
      new_balance: newBalance
    })

  } catch (error) {
    console.error('Error in deductAmount:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export { paymentStatusById, deductAmount }
