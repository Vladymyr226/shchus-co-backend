import { NextFunction, Request, Response } from 'express'
import { Schema } from 'joi'

export const validateSchema = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query)

    if (error) return res.status(400).json({ error: error.details[0].message })

    next()
  }
}
