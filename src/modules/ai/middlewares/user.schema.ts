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

export const userNoteSchema = Joi.object({
  transcribe_text: Joi.string().optional().trim(),
  image: Joi.string().optional(),
  note_id: Joi.number().optional(),
})

export const userGoalSchema = Joi.object({
  transcribe_text: Joi.string().optional().trim(),
  image: Joi.string().optional(),
  goal_id: Joi.number().optional(),
  is_completed: Joi.boolean().optional(),
})

export const userTaskSchema = Joi.object({
  transcribe_text: Joi.string().optional().trim(),
  image: Joi.string().optional(),
  task_id: Joi.number().optional(),
  is_completed: Joi.boolean().optional(),
})

export const userDeadlineSchema = Joi.object({
  transcribe_text: Joi.string().optional().trim(),
  image: Joi.string().optional(),
  deadline_id: Joi.number().optional(),
  is_completed: Joi.boolean().optional(),
  date_time_at: Joi.string().optional(),
})
