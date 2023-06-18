import { Router } from 'express'
import { createProduct } from '../controllers/products.controllers'
import multer from 'multer'
import { fileFilter } from '../../../../middleware/fileFilter'
import { createConstructor } from '../../constructor/controllers/constructor.controller'
import { constructorByName } from '../../constructor/controllers/constructors.controller'

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

  router.post('/product', multiUploadProducts, createProduct)
  router.post('/constructor', multiUploadConstructor, createConstructor)
  router.get('/constructor-by', constructorByName)

  return router
}
