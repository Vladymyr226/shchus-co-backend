import { Router } from 'express'
import {
  createMyAboutBureau,
  myAboutBureaus,
  updateMyAboutBureau,
} from '../controllers/about-bureau'
import {
  createMyMessageToPeople,
  createMyMessageToPeopleModal,
  getMyMessageToPeople,
  getMyMessageToPeopleModal,
  updateMyMessageToPeople,
} from '../controllers/message-from-shchus/message-to-people'
import {
  createMyMessageToInventors,
  createMyMessageToInventorsModal,
  getMyMessageToInventors,
  getMyMessageToInventorsModal,
  updateMyMessageToInventors,
} from '../controllers/message-from-shchus/message-to-inventors'
import {
  createMyMessageToInvestors,
  createMyMessageToInvestorsModal,
  getMyMessageToInvestors,
  getMyMessageToInvestorsModal,
  updateMyMessageToInvestors,
} from '../controllers/message-from-shchus/message-to-investors'
import {
  createMyMessageToShchus,
  createMyMessageToShchusModal,
  getMyMessageToShchus,
  getMyMessageToShchusModal,
  updateMyMessageToShchus,
} from '../controllers/message-from-shchus/message-to-shchus'

export function createCabinetRouter() {
  const router = Router({ mergeParams: true })

  router.post('/my-about-bureau', createMyAboutBureau)
  router.get('/my-about-bureaus', myAboutBureaus)
  router.put('/my-about-bureau', updateMyAboutBureau)

  // Послання SHCHUS

  router.post('/my-message-to-people', createMyMessageToPeople)
  router.post('/my-message-to-people-modal', createMyMessageToPeopleModal)
  router.get('/my-message-to-people-modal', getMyMessageToPeopleModal)
  router.get('/my-message-to-people', getMyMessageToPeople)
  router.put('/my-message-to-people', updateMyMessageToPeople)

  router.post('/my-message-to-inventors', createMyMessageToInventors)
  router.post('/my-message-to-inventors-modal', createMyMessageToInventorsModal)
  router.get('/my-message-to-inventors-modal', getMyMessageToInventorsModal)
  router.get('/my-message-to-inventors', getMyMessageToInventors)
  router.put('/my-message-to-inventors', updateMyMessageToInventors)

  router.post('/my-message-to-investors', createMyMessageToInvestors)
  router.post('/my-message-to-investors-modal', createMyMessageToInvestorsModal)
  router.get('/my-message-to-investors-modal', getMyMessageToInvestorsModal)
  router.get('/my-message-to-investors', getMyMessageToInvestors)
  router.put('/my-message-to-investors', updateMyMessageToInvestors)

  router.post('/my-message-to-shchus', createMyMessageToShchus)
  router.post('/my-message-to-shchus-modal', createMyMessageToShchusModal)
  router.get('/my-message-to-shchus-modal', getMyMessageToShchusModal)
  router.get('/my-message-to-shchus', getMyMessageToShchus)
  router.put('/my-message-to-shchus', updateMyMessageToShchus)

  return router
}
