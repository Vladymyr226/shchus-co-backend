import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyMessageToPeople(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_message_to_people').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in message-to-people.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyMessageToPeople(req: Request, res: Response) {
  try {
    const getMyMessageToPeople = await db.select('*').from('my_message_to_people')

    return res.status(200).json({ getMyMessageToPeople })
  } catch (error) {
    console.error('Error in message-to-people.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyMessageToPeople(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_message_to_people').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in message-to-people.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
