import { NextFunction, Request, Response } from 'express'
import { Schema } from 'joi'

export const validateSchema = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = Object.keys(req.query).length > 0 ? req.query : req.body
    const { error } = schema.validate(dataToValidate)

    if (error) return res.status(400).json({ error: error.details[0].message })

    next()
  }
}
