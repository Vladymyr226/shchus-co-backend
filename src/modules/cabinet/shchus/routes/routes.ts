import { Router } from 'express'
import {
  createMyAboutBureau,
  myAboutBureaus,
  updateMyAboutBureau,
} from '../controllers/about-bureau'
import {
  createMyMessageToPeople,
  getMyMessageToPeople,
  updateMyMessageToPeople,
} from '../controllers/message-from-shchus/message-to-people'
import {
  createMyMessageToInventors,
  getMyMessageToInventors,
  updateMyMessageToInventors,
} from '../controllers/message-from-shchus/message-to-inventors'
import {
  createMyMessageToInvestors,
  getMyMessageToInvestors,
  updateMyMessageToInvestors,
} from '../controllers/message-from-shchus/message-to-investors'
import {
  createMyMessageToShchus,
  getMyMessageToShchus,
  updateMyMessageToShchus,
} from '../controllers/message-from-shchus/message-to-shchus'

export function createCabinetRouter() {
  const router = Router({ mergeParams: true })

  router.post('/my-about-bureau', createMyAboutBureau)
  router.get('/my-about-bureaus', myAboutBureaus)
  router.put('/my-about-bureau', updateMyAboutBureau)

  // Послання SHCHUS

  // router.post('/my-message-to-people', createMyMessageToPeople)
  // router.get('/my-message-to-people', getMyMessageToPeople)
  // router.put('/my-message-to-people', updateMyMessageToPeople)

  // router.post('/my-message-to-inventors', createMyMessageToInventors)
  // router.get('/my-message-to-inventors', getMyMessageToInventors)
  // router.put('/my-message-to-inventors', updateMyMessageToInventors)

  // router.post('/my-message-to-investors', createMyMessageToInvestors)
  // router.get('/my-message-to-investors', getMyMessageToInvestors)
  // router.put('/my-message-to-investors', updateMyMessageToInvestors)

  // router.post('/my-message-to-shchus', createMyMessageToShchus)
  // router.get('/my-message-to-shchus', getMyMessageToShchus)
  // router.put('/my-message-to-shchus', updateMyMessageToShchus)

  return router
}
