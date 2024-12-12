import { Request, Response } from 'express'
import db from '../../../db/knexKonfig'

export async function getPayments(req: Request, res: Response) {
  try {
    const getPayments = await db('subscriptions')
      .join('users', 'subscriptions.user_id', '=', 'users.id')
      .join('course', 'subscriptions.course_id', '=', 'course.id')
      .select(
        'users.user_name',
        'users.email',
        db.raw(`course.data->>'title' as course_title`),
        'subscriptions.price',
        'subscriptions.order_status',
        'subscriptions.order_time',
        'subscriptions.order_id'
      )

    return res.status(200).json({ getPayments })
  } catch (error) {
    console.error('Error in payment.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
