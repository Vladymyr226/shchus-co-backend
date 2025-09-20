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

    const user = await db('users-ai')
    .select('total_amount')
    .where({ id: userId })
    .first()

    // Перевіряємо, чи достатньо коштів
    if (user.total_amount <=0) {
      return res.status(400).json({ 
        message: 'Insufficient funds',
        current_balance: user.total_amount,
        requested_amount: amount
      })
    }

    // Зменшуємо загальну суму користувача
    const newBalance = await db('users-ai')
      .where({ id: userId })
      .decrement('total_amount', amount)

    return res.status(200).json({
      message: 'Amount deducted successfully',
      previous_balance: user.total_amount,
      deducted_amount: amount,
      new_balance: newBalance
    })

  } catch (error) {
    console.error('Error in deductAmount:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

const getUserTotalAmount = async (req: ExpressRequest, res: Response) => {
  const userId = req.user_id

  try {
    const user = await db('users-ai')
      .select('total_amount')
      .where({ id: userId })
      .first()

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({
      amount: user.total_amount || 0
    })

  } catch (error) {
    console.error('Error getting user total amount:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export { paymentStatusById, deductAmount, getUserTotalAmount }
