import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyMarketplace(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_marketplace').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in marketplace.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyMarketplace(req: Request, res: Response) {
  try {
    const getMyMarketplace = await db.select('*').from('my_marketplace')

    return res.status(200).json({ getMyMarketplace })
  } catch (error) {
    console.error('Error in marketplace.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyMarketplace(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_marketplace').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in marketplace.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
