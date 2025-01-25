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
import {
  createMyModal,
  getMyModalById,
  getMyModalsById,
  updateMyModalById,
} from '../controllers/modals'
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
import {
  createMyConstructorBusiness,
  getMyConstructorBusiness,
  updateMyConstructorBusiness,
} from '../controllers/constructor/business'
import {
  createMyConstructorIpo,
  getMyConstructorIpo,
  updateMyConstructorIpo,
} from '../controllers/constructor/ipo'
import {
  createMyConstructorCollaborations,
  getMyConstructorCollaborations,
  updateMyConstructorCollaborations,
} from '../controllers/constructor/collaborations'
import {
  createMyConstructorMillion,
  getMyConstructorMillion,
  updateMyConstructorMillion,
} from '../controllers/constructor/million'
import {
  createMyConstructorProducts,
  getMyConstructorProducts,
  updateMyConstructorProducts,
} from '../controllers/constructor/products'
import {
  createMyConstructorOfMyDreams,
  getMyConstructorOfMyDreams,
  updateMyConstructorOfMyDreams,
} from '../controllers/constructor/of-my-dreams'
import {
  createMyConstructorTalents,
  getMyConstructorTalents,
  updateMyConstructorTalents,
} from '../controllers/constructor/talents'
import {
  createMyConstructorPath,
  getMyConstructorPath,
  updateMyConstructorPath,
} from '../controllers/constructor/path'
import {
  createMyConstructorOpportunities,
  getMyConstructorOpportunities,
  updateMyConstructorOpportunities,
} from '../controllers/constructor/opportunities'
import {
  createMyConstructorIdeas,
  getMyConstructorIdeas,
  updateMyConstructorIdeas,
} from '../controllers/constructor/ideas'
import {
  createMyAboutShchus,
  getMyAboutShchus,
  updateMyAboutShchus,
} from '../controllers/about-shchus'
import {
  createMyAttitudeShchus,
  getMyAttitudeShchus,
  updateMyAttitudeShchus,
} from '../controllers/attitude-shchus'
import { createMyProduct, getMyProducts, updateMyProduct, deleteMyProduct, getMyProductById } from '../controllers/products'
import {
  createMyArchiveHub,
  getMyArchiveHub,
  getMyArchiveHubById,
  updateMyArchiveHub,
  deleteMyArchiveHub,
} from '../controllers/archive-hub'

export function createCabinetRouter() {
  const router = Router({ mergeParams: true })

  // работа с модалками

  router.post('/modal', createMyModal)
  router.get('/modal-by-id', getMyModalById)
  router.put('/modal-by-id', updateMyModalById)
  router.get('/modals-by-id', getMyModalsById)

  //Про Щусь

  router.post('/my-about-shchus', createMyAboutShchus)
  router.get('/my-about-shchus', getMyAboutShchus)
  router.put('/my-about-shchus', updateMyAboutShchus)

  // Про Бюро Щусь

  router.post('/my-about-bureau', createMyAboutBureau)
  router.get('/my-about-bureaus', myAboutBureaus)
  router.put('/my-about-bureau', updateMyAboutBureau)

  // Настанова Щусь

  router.post('/my-attitude-shchus', createMyAttitudeShchus)
  router.get('/my-attitude-shchus', getMyAttitudeShchus)
  router.put('/my-attitude-shchus', updateMyAttitudeShchus)

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

  // Constructors

  router.post('/my-constructor/million', createMyConstructorMillion)
  router.get('/my-constructor/million', getMyConstructorMillion)
  router.put('/my-constructor/million', updateMyConstructorMillion)

  router.post('/my-constructor/products', createMyConstructorProducts)
  router.get('/my-constructor/products', getMyConstructorProducts)
  router.put('/my-constructor/products', updateMyConstructorProducts)

  router.post('/my-constructor/of-my-dreams', createMyConstructorOfMyDreams)
  router.get('/my-constructor/of-my-dreams', getMyConstructorOfMyDreams)
  router.put('/my-constructor/of-my-dreams', updateMyConstructorOfMyDreams)

  router.post('/my-constructor/talents', createMyConstructorTalents)
  router.get('/my-constructor/talents', getMyConstructorTalents)
  router.put('/my-constructor/talents', updateMyConstructorTalents)

  router.post('/my-constructor/path', createMyConstructorPath)
  router.get('/my-constructor/path', getMyConstructorPath)
  router.put('/my-constructor/path', updateMyConstructorPath)

  router.post('/my-constructor/opportunities', createMyConstructorOpportunities)
  router.get('/my-constructor/opportunities', getMyConstructorOpportunities)
  router.put('/my-constructor/opportunities', updateMyConstructorOpportunities)

  router.post('/my-constructor/ideas', createMyConstructorIdeas)
  router.get('/my-constructor/ideas', getMyConstructorIdeas)
  router.put('/my-constructor/ideas', updateMyConstructorIdeas)

  router.post('/my-constructor/collaborations', createMyConstructorCollaborations)
  router.get('/my-constructor/collaborations', getMyConstructorCollaborations)
  router.put('/my-constructor/collaborations', updateMyConstructorCollaborations)

  router.post('/my-constructor/business', createMyConstructorBusiness)
  router.get('/my-constructor/business', getMyConstructorBusiness)
  router.put('/my-constructor/business', updateMyConstructorBusiness)

  router.post('/my-constructor/ipo', createMyConstructorIpo)
  router.get('/my-constructor/ipo', getMyConstructorIpo)
  router.put('/my-constructor/ipo', updateMyConstructorIpo)

  //Продукти

  router.post('/my-product', createMyProduct)
  router.get('/my-products', getMyProducts)
  router.get('/my-product/by-id', getMyProductById)
  router.put('/my-product', updateMyProduct)
  router.delete('/my-product', deleteMyProduct)

  // Архів-Хаб

  router.post('/my-archive-hub', createMyArchiveHub)
  router.get('/my-archive-hub', getMyArchiveHub)
  router.get('/my-archive-hub/by-id', getMyArchiveHubById)
  router.put('/my-archive-hub', updateMyArchiveHub)
  router.delete('/my-archive-hub', deleteMyArchiveHub)

  return router
}
