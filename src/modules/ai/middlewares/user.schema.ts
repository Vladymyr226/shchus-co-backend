import Joi from 'joi'
import phoneNumber from 'joi-phone-number'

export const userRegisterSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[а-яА-Яa-zA-Z\-]{2,32}$/)
    .required()
    .trim(),
  email: Joi.string().max(40).lowercase().email().required().trim(),
  password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,100}')).trim(),
})

export const userLoginSchema = Joi.object({
  email: Joi.string().optional().max(40).lowercase().email().trim(),
  password: Joi.string().optional().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,100}')).trim(),
  google_token: Joi.string().optional(),
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

const customJoi = Joi.extend(phoneNumber)

export const tgBotSchema = Joi.object({
  phone_number: customJoi
    .string()
    .phoneNumber({
      defaultCountry: 'UA',
      format: 'international',
    })
    .message('Phone number is invalid'),
})

export const analyzedFilesSchema = Joi.object({
  files: Joi.array().items(
    Joi.object({
      fileName: Joi.string().required(),
      fileSize: Joi.number().required(),
      fileType: Joi.string().required(),
      s3Url: Joi.string().required(),
      analysis: Joi.object({
        summary: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required(),
        category: Joi.string().required(),
        importance: Joi.number().required(),
        keyPoints: Joi.array().items(Joi.string()).required(),
        technicalDetails: Joi.string().optional(),
        dataPoints: Joi.string().optional()
      }).required(),
      isLargeFile: Joi.boolean().required(),
      totalLines: Joi.number().required(),
      isPublic: Joi.boolean().required()
    })
  ).min(1).required()
})
