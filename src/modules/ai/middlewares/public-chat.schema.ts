import Joi from 'joi'

// Схема для відправки повідомлення в загальний чат
export const sendPublicChatMessageSchema = Joi.object({
  content: Joi.string().min(1).max(5000).required().messages({
    'string.base': 'Message content must be a string',
    'string.empty': 'Message content cannot be empty',
    'string.min': 'Message content must be at least 1 character',
    'string.max': 'Message content cannot exceed 5000 characters',
    'any.required': 'Message content is required',
  }),
  replyToId: Joi.number().integer().positive().optional().messages({
    'number.base': 'Reply to ID must be a number',
    'number.integer': 'Reply to ID must be an integer',
    'number.positive': 'Reply to ID must be positive',
  }),
})

// Схема для зміни статусу закріплення
export const togglePinMessageSchema = Joi.object({
  isPinned: Joi.boolean().optional().messages({
    'boolean.base': 'isPinned must be a boolean',
  }),
})
