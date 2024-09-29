import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyMessageToInvestors(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_message_to_investors').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in message-to-investors.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyMessageToInvestors(req: Request, res: Response) {
  try {
    const getMyMessageToInvestors = await db.select('*').from('my_message_to_investors')

    return res.status(200).json({ getMyMessageToInvestors })
  } catch (error) {
    console.error('Error in message-to-investors.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyMessageToInvestors(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_message_to_investors').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in message-to-investors.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
