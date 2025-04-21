import { Router } from 'express'
import multer from 'multer'
import { validateSchema } from '../../../middleware/validate.schema'
import {
  userDeadlineSchema,
  userGoalSchema,
  userLoginSchema,
  userNoteSchema,
  userRegisterSchema,
  userTaskSchema,
} from '../middlewares/user.schema'
import {
  myDeadlinesDelete,
  myDeadlinesPost,
  myDeadlinesPut,
  myGoalsDelete,
  myGoalsPost,
  myGoalsPut,
  myNotesAll,
  myNotesDelete,
  myNotesPost,
  myNotesPut,
  myTasksDelete,
  myTasksPost,
  myTasksPut,
} from '../controllers/notes'
import { checkStatus, generateImage } from '../controllers/ai'
import { authMiddleware } from '../middlewares/user.auth'
import { forgotPassword, login, registration, resetPassword } from '../controllers/auth'
import { myPortfolioDeleteIdea, myPortfolioGet, myPortfolioPost, myPortfolioPut } from '../controllers/portfolio'

export function createAIRouter() {
  const router = Router({ mergeParams: true })

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024, // ограничение размера файла до 10MB
    },
  })

  router.post('/generate/generate-image', generateImage)
  router.get('/generate/check-status/:id', checkStatus)
  router.post('/forgot-password', forgotPassword)
  router.post('/reset-password', resetPassword)

  router.post('/register', validateSchema(userRegisterSchema), registration)
  router.post('/login', validateSchema(userLoginSchema), login)

  router.post('/notes', validateSchema(userNoteSchema), authMiddleware, myNotesPost)
  router.put('/notes', validateSchema(userNoteSchema), authMiddleware, myNotesPut)
  router.delete('/notes/:id', authMiddleware, myNotesDelete)
  router.post('/goals', validateSchema(userGoalSchema), authMiddleware, myGoalsPost)
  router.put('/goals', validateSchema(userGoalSchema), authMiddleware, myGoalsPut)
  router.delete('/goals/:id', authMiddleware, myGoalsDelete)
  router.post('/tasks', validateSchema(userTaskSchema), authMiddleware, myTasksPost)
  router.put('/tasks', validateSchema(userTaskSchema), authMiddleware, myTasksPut)
  router.delete('/tasks/:id', authMiddleware, myTasksDelete)
  router.post('/deadlines', validateSchema(userDeadlineSchema), authMiddleware, myDeadlinesPost)
  router.put('/deadlines', validateSchema(userDeadlineSchema), authMiddleware, myDeadlinesPut)
  router.delete('/deadlines/:id', authMiddleware, myDeadlinesDelete)
  router.get('/notes-all', authMiddleware, myNotesAll)

  router.get('/ideas', authMiddleware, myPortfolioGet)
  router.post('/ideas', authMiddleware, myPortfolioPost)
  router.put('/ideas/:idea_id', authMiddleware, myPortfolioPut)
  router.delete('/ideas/:idea_id', authMiddleware, myPortfolioDeleteIdea)

  return router
}
