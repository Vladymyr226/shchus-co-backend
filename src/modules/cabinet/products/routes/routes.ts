import { Router } from 'express'
import { createProduct } from '../controllers/products.controllers'
import multer from 'multer'
import { fileFilter } from '../../../../middleware/fileFilter'
import { createConstructor } from '../../constructor/controllers/constructor.controller'
import { constructorByName } from '../../constructor/controllers/constructors.controller'
import { createMyAboutBureau } from '../../my-about-bureau/controllers/my-about-bureau.controller'
import { myAboutBureaus } from '../../my-about-bureau/controllers/my-about-bureaus.controller'
import { createMyAboutShchus } from '../../my-about-shchus/controllers/my-about-shchus.controller'
import { myAboutShchuses } from '../../my-about-shchus/controllers/my-about-shchuses.controller'
import {
  myArchiveHubById,
  myArchiveHubs,
} from '../../my-archive-hub/controllers/my-archive-hubs.controller'
import { createMyArchiveHub } from '../../my-archive-hub/controllers/my-archive-hub.controller'
import { myConstructorDesigners } from '../../my-constructor-designers/controllers/my-constructor-designers.controller'
import { createMyConstructorDesigner } from '../../my-constructor-designers/controllers/my-constructor-designer.controller'
import { createMyConstructorStartup } from '../../my-constructor-startups/controllers/my-constructor-startup.controller'
import { myConstructorStartups } from '../../my-constructor-startups/controllers/my-constructor-startups.controller'
import { createMyConstructorTalent } from '../../my-constructor-talents/controllers/my-constructor-talent.controller'
import { myConstructorTalents } from '../../my-constructor-talents/controllers/my-constructor-talents.controller'
import { createMyConstructorIdea } from '../../my-constructor-ideas/controllers/my-constructor-idea.controller'
import { myConstructorIdeas } from '../../my-constructor-ideas/controllers/my-constructor-ideas.controller'

export function createCabinetRouter() {
  const router = Router({ mergeParams: true })

  const upload = multer({ fileFilter, limits: { fileSize: 50 * 1024 * 1024 } })

  const multiUploadProducts = upload.fields([
    { name: 'imgFile', maxCount: 1 },
    { name: 'videoFile', maxCount: 1 },
    { name: 'pdfFile', maxCount: 1 },
    { name: 'publicArchiveFile', maxCount: 1 },
    { name: 'privateArchiveFile', maxCount: 1 },
  ])

  const multiUploadConstructor = upload.fields([
    { name: 'overlookProductVideo', maxCount: 1 },
    { name: 'overlookConstructorVideo', maxCount: 1 },
    { name: 'archiveMaterials', maxCount: 1 },
    { name: 'archiveTools', maxCount: 1 },
    { name: 'archiveHypotheses', maxCount: 1 },
    { name: 'pitchPrototypeVideo', maxCount: 1 },
    { name: 'archiveHeadMetricsPrototype', maxCount: 1 },
    { name: 'laboratoryExperimentsVideo', maxCount: 1 },
    { name: 'archivePrototypingLaboratory', maxCount: 1 },
    { name: 'archiveExperimentLibrary', maxCount: 1 },
    { name: 'archiveProductTesting', maxCount: 1 },
    { name: 'pitchProductVideo', maxCount: 1 },
    { name: 'archiveProductMainMetrics', maxCount: 1 },
    { name: 'archiveInvestments', maxCount: 1 },
    { name: 'archiveLegislativeFoundation', maxCount: 1 },
    { name: 'archiveLaunchEnterprise', maxCount: 1 },
  ])

  // const multiUploadMyAboutBureau = upload.fields([
  //   { name: 'imgFile0', maxCount: 1 },
  //   { name: 'imgFile1', maxCount: 1 },
  //   { name: 'imgFile2', maxCount: 1 },
  //   { name: 'imgFile3', maxCount: 1 },
  //   { name: 'imgFile4', maxCount: 1 },
  //   { name: 'videoFile', maxCount: 1 },
  //   { name: 'videoFile1', maxCount: 1 },
  //   { name: 'pdfFile', maxCount: 1 },
  // ])

  // const multiUploadMyAboutShchus = upload.fields([
  //   { name: 'imgFile0', maxCount: 1 },
  //   { name: 'imgFile2', maxCount: 1 },
  //   { name: 'imgFile3', maxCount: 1 },
  //   { name: 'imgFile4', maxCount: 1 },
  //   { name: 'imgFile5', maxCount: 1 },
  //   { name: 'pdfFile', maxCount: 1 },
  // ])

  // const multiUploadMyArchiveHub = upload.fields([
  //   { name: 'imgFile0', maxCount: 1 },
  //   { name: 'archiveFile0', maxCount: 1 },
  // ])

  // const multiUploadMyConstructorDesigner = upload.fields([
  //   { name: 'videoFile0', maxCount: 1 },
  //   { name: 'imgFile0', maxCount: 1 },
  //   { name: 'imgFile2', maxCount: 1 },
  //   { name: 'videoFile1', maxCount: 1 },
  //   { name: 'archiveFile0', maxCount: 1 },
  // ])

  // const multiUploadMyConstructorStartup = upload.fields([
  //   { name: 'videoFile0', maxCount: 1 },
  //   { name: 'imgFile0', maxCount: 1 },
  //   { name: 'imgFile2', maxCount: 1 },
  //   { name: 'videoFile1', maxCount: 1 },
  //   { name: 'archiveFile0', maxCount: 1 },
  // ])

  // const multiUploadMyConstructorTalent = upload.fields([
  //   { name: 'videoFile0', maxCount: 1 },
  //   { name: 'imgFile0', maxCount: 1 },
  //   { name: 'imgFile2', maxCount: 1 },
  //   { name: 'videoFile1', maxCount: 1 },
  //   { name: 'archiveFile0', maxCount: 1 },
  // ])

  // const multiUploadMyConstructorIdea = upload.fields([
  //   { name: 'videoFile0', maxCount: 1 },
  //   { name: 'imgFile0', maxCount: 1 },
  //   { name: 'imgFile2', maxCount: 1 },
  //   { name: 'videoFile1', maxCount: 1 },
  //   { name: 'archiveFile0', maxCount: 1 },
  // ])

  router.post('/product', multiUploadProducts, createProduct)
  router.post('/constructor', multiUploadConstructor, createConstructor)
  router.get('/constructor-by', constructorByName)

  // cb ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  router.post('/my-about-bureau', createMyAboutBureau)
  router.get('/my-about-bureaus', myAboutBureaus)

  router.post('/my-about-shchus', createMyAboutShchus)
  router.get('/my-about-shchuses', myAboutShchuses)

  router.post('/my-archive-hub', createMyArchiveHub)
  router.get('/my-archive-hubs', myArchiveHubs)
  router.get('/my-archive-hub-by', myArchiveHubById)

  router.post('/my-constructor-designer', createMyConstructorDesigner)
  router.get('/my-constructor-designers', myConstructorDesigners)

  router.post('/my-constructor-startup', createMyConstructorStartup)
  router.get('/my-constructor-startups', myConstructorStartups)

  router.post('/my-constructor-talent', createMyConstructorTalent)
  router.get('/my-constructor-talents', myConstructorTalents)

  router.post('/my-constructor-idea', createMyConstructorIdea)
  router.get('/my-constructor-ideas', myConstructorIdeas)

  return router
}
