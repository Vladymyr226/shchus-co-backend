import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyConstructorOpportunities(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_constructor_opportunities').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in my constructor opportunities', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyConstructorOpportunities(req: Request, res: Response) {
  try {
    const getMyConstructorOpportunities = await db.select('*').from('my_constructor_opportunities')

    return res.status(200).json({ getMyConstructorOpportunities })
  } catch (error) {
    console.error('Error in my constructor opportunities', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyConstructorOpportunities(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_constructor_opportunities').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in my constructor opportunities', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
