import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../middleware/error.middleware'

export async function createMyAboutBureau(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_about_bureau').insert({ data: json }).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in my-about-bureau.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function myAboutBureaus(req: Request, res: Response) {
  try {
    const myAboutBureaus = await db.select('*').from('my_about_bureau')

    return res.status(200).json({ myAboutBureaus })
  } catch (error) {
    console.error('Error in my-about-bureau.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyAboutBureau(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_about_bureau').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in my-about-bureau.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
