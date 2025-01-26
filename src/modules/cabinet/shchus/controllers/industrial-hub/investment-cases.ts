import { Request, Response } from 'express'
import db from '../../../../../db/knexKonfig'
import { CREATED, UPDATED } from '../../../../../middleware/error.middleware'

export async function createMyIndustrialHubInvestmentCases(req, res: Response) {
  const json = req.body

  try {
    const newItem = await db('my_industrial_hub_investment_cases')
      .insert({ data: json })
      .returning('*')
    console.log(newItem)

    return res.status(201).json({ message: CREATED })
  } catch (error) {
    console.error('Error in my-investment-cases.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function getMyIndustrialHubInvestmentCases(req: Request, res: Response) {
  try {
    const getMyIndustrialHubInvestmentCases = await db
      .select('*')
      .from('my_industrial_hub_investment_cases')

    return res.status(200).json({ getMyIndustrialHubInvestmentCases })
  } catch (error) {
    console.error('Error in my-investment-cases.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function updateMyIndustrialHubInvestmentCases(req: Request, res: Response) {
  const newJson = req.body

  try {
    await db.table('my_industrial_hub_investment_cases').update({ data: newJson })

    return res.status(200).json({ message: UPDATED })
  } catch (error) {
    console.error('Error in my-investment-cases.controller.ts', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
