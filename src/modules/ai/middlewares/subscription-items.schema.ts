import Joi from 'joi'

export const subscriptionItemCreateSchema = Joi.object({
  description: Joi.string().max(255).required().trim(),
  unit: Joi.string().max(100).required().trim(),
  unit_cost: Joi.number().precision(3).positive().required(),
  package: Joi.number().integer().positive().required(),
  price: Joi.number().precision(3).positive().required(),
  dimension: Joi.string().max(50).required().trim()
})

export const subscriptionItemUpdateSchema = Joi.object({
  description: Joi.string().max(255).optional().trim(),
  unit: Joi.string().max(100).optional().trim(),
  unit_cost: Joi.number().precision(3).positive().optional(),
  package: Joi.number().integer().positive().optional(),
  price: Joi.number().precision(3).positive().optional(),
  dimension: Joi.string().max(50).optional().trim()
})

export const deductAmountSchema = Joi.object({
  amount: Joi.number().precision(3).positive().required()
})
