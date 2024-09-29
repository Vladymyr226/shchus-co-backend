import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyMessageToInventors(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_message_to_inventors').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in message-to-inventors', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyMessageToInventors(req: Request, res: Response) {
  try {
    const getMyMessageToInventors = await db.select('*').from('my_message_to_inventors')

    return res.status(200).json({ getMyMessageToInventors })
  } catch (error) {
    console.error('Error in message-to-inventors', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyMessageToInventors(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_message_to_inventors').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in message-to-inventors', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
