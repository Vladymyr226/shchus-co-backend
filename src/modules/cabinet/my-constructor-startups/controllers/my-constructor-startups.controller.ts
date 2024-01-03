import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'

export async function myConstructorStartups(req: Request, res: Response) {
  try {
    const myConstructorStartups = await db.select('*').from('constructor_startups')

    return res.status(200).json({ myConstructorStartups })
  } catch (error) {
    console.error('Error in my-constructor-startups.controller', error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
