import Joi from 'joi'

export const userRegisterSchema = Joi.object({
  name: Joi.string().alphanum().min(2).max(32).required().trim(),
  email: Joi.string().max(40).lowercase().email().required().trim(),
  password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,100}')).trim(),
})

export const userLoginSchema = Joi.object({
  email: Joi.string().max(40).lowercase().email().required().trim(),
  password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,100}')).trim(),
})
