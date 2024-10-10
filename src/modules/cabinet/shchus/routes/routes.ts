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
import { createMyLife, getMyLife, updateMyLife } from '../controllers/life'
import {
  createMyPartnership,
  getMyPartnership,
  updateMyPartnership,
} from '../controllers/partnership'
import { createMyModal, getMyModalById, updateMyModalById } from '../controllers/modals'
import {
  createMyShchusLifeEnergy,
  getMyShchusLifeEnergy,
  updateMyShchusLifeEnergy,
} from '../controllers/shchus-life/energy'
import {
  createMyShchusLifeTimeOfLife,
  getMyShchusLifeTimeOfLife,
  updateMyShchusLifeTimeOfLife,
} from '../controllers/shchus-life/time-of-life'
import {
  createMyShchusLifeBrain,
  getMyShchusLifeBrain,
  updateMyShchusLifeBrain,
} from '../controllers/shchus-life/brain'
import {
  createMyShchusLifeHealth,
  getMyShchusLifeHealth,
  updateMyShchusLifeHealth,
} from '../controllers/shchus-life/health'
import {
  createMyShchusLifeWisdom,
  getMyShchusLifeWisdom,
  updateMyShchusLifeWisdom,
} from '../controllers/shchus-life/wisdom'

export function createCabinetRouter() {
  const router = Router({ mergeParams: true })

  // работа с модалками

  router.post('/modal', createMyModal)
  router.get('/modal-by-id', getMyModalById)
  router.put('/modal-by-id', updateMyModalById)

  // Про Бюро Щусь

  router.post('/my-about-bureau', createMyAboutBureau)
  router.get('/my-about-bureaus', myAboutBureaus)
  router.put('/my-about-bureau', updateMyAboutBureau)

  // Послання SHCHUS

  router.post('/my-message-to-people', createMyMessageToPeople)
  router.get('/my-message-to-people', getMyMessageToPeople)
  router.put('/my-message-to-people', updateMyMessageToPeople)

  router.post('/my-message-to-inventors', createMyMessageToInventors)
  router.get('/my-message-to-inventors', getMyMessageToInventors)
  router.put('/my-message-to-inventors', updateMyMessageToInventors)

  router.post('/my-message-to-investors', createMyMessageToInvestors)
  router.get('/my-message-to-investors', getMyMessageToInvestors)
  router.put('/my-message-to-investors', updateMyMessageToInvestors)

  router.post('/my-message-to-shchus', createMyMessageToShchus)
  router.get('/my-message-to-shchus', getMyMessageToShchus)
  router.put('/my-message-to-shchus', updateMyMessageToShchus)

  //Є лайф

  router.post('/my-life', createMyLife)
  router.get('/my-life', getMyLife)
  router.put('/my-life', updateMyLife)

  //Є партнерство

  router.post('/my-partnership', createMyPartnership)
  router.get('/my-partnership', getMyPartnership)
  router.put('/my-partnership', updateMyPartnership)

  // Shchus Life

  router.post('/my-shchus-life/energy', createMyShchusLifeEnergy)
  router.get('/my-shchus-life/energy', getMyShchusLifeEnergy)
  router.put('/my-shchus-life/energy', updateMyShchusLifeEnergy)

  router.post('/my-shchus-life/time-of-life', createMyShchusLifeTimeOfLife)
  router.get('/my-shchus-life/time-of-life', getMyShchusLifeTimeOfLife)
  router.put('/my-shchus-life/time-of-life', updateMyShchusLifeTimeOfLife)

  router.post('/my-shchus-life/brain', createMyShchusLifeBrain)
  router.get('/my-shchus-life/brain', getMyShchusLifeBrain)
  router.put('/my-shchus-life/brain', updateMyShchusLifeBrain)

  router.post('/my-shchus-life/wisdom', createMyShchusLifeWisdom)
  router.get('/my-shchus-life/wisdom', getMyShchusLifeWisdom)
  router.put('/my-shchus-life/wisdom', updateMyShchusLifeWisdom)

  router.post('/my-shchus-life/health', createMyShchusLifeHealth)
  router.get('/my-shchus-life/health', getMyShchusLifeHealth)
  router.put('/my-shchus-life/health', updateMyShchusLifeHealth)

  return router
}
