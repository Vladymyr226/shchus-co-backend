import Joi from 'joi'

// Схема для створення/отримання чату
export const createChatSchema = Joi.object({
  targetUserId: Joi.number().integer().positive().required().messages({
    'number.base': 'Target user ID must be a number',
    'number.integer': 'Target user ID must be an integer',
    'number.positive': 'Target user ID must be positive',
    'any.required': 'Target user ID is required',
  }),
})

// Схема для відправки повідомлення
export const sendMessageSchema = Joi.object({
  content: Joi.string().min(1).max(5000).required().messages({
    'string.base': 'Message content must be a string',
    'string.empty': 'Message content cannot be empty',
    'string.min': 'Message content must be at least 1 character',
    'string.max': 'Message content cannot exceed 5000 characters',
    'any.required': 'Message content is required',
  }),
})

// Схема для пошуку користувачів
export const searchUsersSchema = Joi.object({
  query: Joi.string().min(1).max(100).messages({
    'string.base': 'Search query must be a string',
    'string.empty': 'Search query cannot be empty',
    'string.min': 'Search query must be at least 1 character',
    'string.max': 'Search query cannot exceed 100 characters',
  }),
})

