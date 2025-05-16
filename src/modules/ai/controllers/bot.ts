import { ExpressRequest } from '../middlewares/user.auth'
import { Response } from 'express'
import db from '../../../db/knexKonfig'

export async function tgBotGet(req: ExpressRequest, res: Response) {
  const user_id = req.user_id

  try {
    const user = await db.select().from('tg-bot-ai').where({ user_id })

    if (!user.length) {
      return res.status(404).json({ error: 'User is not found!' })
    }
    const is_verified = !!user[0].chat_id
    res.status(201).json({ success: true, id: user[0].user_id, is_verified, phone_number: user[0].phone_number })
  } catch (error) {
    console.error('Error in notes.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function tgBotPost(req: ExpressRequest, res: Response) {
  const user_id = req.user_id
  const { phone_number } = req.query
  console.log(phone_number)
  try {
    await db('tg-bot-ai').insert({ user_id, phone_number }).returning('*')

    res.status(201).json({ success: true })
  } catch (error) {
    console.error('Error in notes.ts', error)
    return res.status(400).json({ error })
  }
}
