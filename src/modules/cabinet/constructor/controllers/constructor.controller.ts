import { Response } from 'express'
import db from '../../../../db/knexKonfig'
import { uploadFileToS3 } from '../../../../helper/helper'

export async function createConstructor(req, res: Response) {
  const {
    product,
    coreConstructorProduct,
    archiveMaterials1,
    archiveMaterials2,
    archiveMaterials3,
    archiveTools1,
    archiveTools2,
    archiveTools3,
    archiveHypotheses1,
    archiveHypotheses2,
    archiveHypotheses3,
    archiveHeadMetricsPrototype1,
    archiveHeadMetricsPrototype2,
    archiveHeadMetricsPrototype3,
    archivePrototypingLaboratory1,
    archivePrototypingLaboratory2,
    archivePrototypingLaboratory3,
    archiveExperimentLibrary1,
    archiveExperimentLibrary2,
    archiveExperimentLibrary3,
    archiveProductTesting1,
    archiveProductTesting2,
    archiveProductTesting3,
    archiveProductMainMetrics1,
    archiveProductMainMetrics2,
    archiveProductMainMetrics3,
    archiveInvestments1,
    archiveInvestments2,
    archiveInvestments3,
    archiveLegislativeFoundation1,
    archiveLegislativeFoundation2,
    archiveLegislativeFoundation3,
    archiveLaunchEnterprise1,
    archiveLaunchEnterprise2,
    archiveLaunchEnterprise3,
    launchShchusHub,
  } = req.query

  const arrDifferentTypesFiles = Object.keys(req.files)
  let arrFiles: any[] = []
  for (let index = 0; index < arrDifferentTypesFiles.length; index++) {
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: req.files[arrDifferentTypesFiles[index]][0].originalname,
      Body: Buffer.from(req.files[arrDifferentTypesFiles[index]][0].buffer),
      ContentType: req.files[arrDifferentTypesFiles[index]][0].mimetype,
      ACL: 'public-read',
    }
    try {
      const location = await uploadFileToS3(uploadParams)
      arrFiles.push(location)
    } catch (error) {
      console.log('Error in constructor.controller.ts: ', error)
    }
  }
  const constructorToDB = {
    product,
    core_constructor_product: coreConstructorProduct as string,
    archive_materials1: archiveMaterials1 as string,
    archive_materials2: archiveMaterials2 as string,
    archive_materials3: archiveMaterials3 as string,
    archive_tools1: archiveTools1 as string,
    archive_tools2: archiveTools2 as string,
    archive_tools3: archiveTools3 as string,
    archive_hypotheses1: archiveHypotheses1 as string,
    archive_hypotheses2: archiveHypotheses2 as string,
    archive_hypotheses3: archiveHypotheses3 as string,
    archive_head_metrics_prototype1: archiveHeadMetricsPrototype1 as string,
    archive_head_metrics_prototype2: archiveHeadMetricsPrototype2 as string,
    archive_head_metrics_prototype3: archiveHeadMetricsPrototype3 as string,
    archive_prototyping_laboratory1: archivePrototypingLaboratory1 as string,
    archive_prototyping_laboratory2: archivePrototypingLaboratory2 as string,
    archive_prototyping_laboratory3: archivePrototypingLaboratory3 as string,
    archive_experiment_library1: archiveExperimentLibrary1 as string,
    archive_experiment_library2: archiveExperimentLibrary2 as string,
    archive_experiment_library3: archiveExperimentLibrary3 as string,
    archive_product_testing1: archiveProductTesting1 as string,
    archive_product_testing2: archiveProductTesting2 as string,
    archive_product_testing3: archiveProductTesting3 as string,
    archive_product_main_metrics1: archiveProductMainMetrics1 as string,
    archive_product_main_metrics2: archiveProductMainMetrics2 as string,
    archive_product_main_metrics3: archiveProductMainMetrics3 as string,
    archive_investments1: archiveInvestments1 as string,
    archive_investments2: archiveInvestments2 as string,
    archive_investments3: archiveInvestments3 as string,
    archive_legislative_foundation1: archiveLegislativeFoundation1 as string,
    archive_legislative_foundation2: archiveLegislativeFoundation2 as string,
    archive_legislative_foundation3: archiveLegislativeFoundation3 as string,
    archive_launch_enterprise1: archiveLaunchEnterprise1 as string,
    archive_launch_enterprise2: archiveLaunchEnterprise2 as string,
    archive_launch_enterprise3: archiveLaunchEnterprise3 as string,
    launch_shchus_hub: launchShchusHub as string,

    overlook_product_video: arrFiles[0] || '',
    overlook_constructor_video: arrFiles[1] || '',
    archive_materials: arrFiles[2] || '',
    archive_tools: arrFiles[3] || '',
    archive_hypotheses: arrFiles[4] || '',
    pitch_prototype_video: arrFiles[5] || '',
    archive_head_metrics_prototype: arrFiles[6] || '',
    laboratory_experiments_video: arrFiles[7] || '',
    archive_prototyping_laboratory: arrFiles[8] || '',
    archive_experiment_library: arrFiles[9] || '',
    archive_product_testing: arrFiles[10] || '',
    pitch_product_video: arrFiles[11] || '',
    archive_product_main_metrics: arrFiles[12] || '',
    archive_investments: arrFiles[13] || '',
    archive_legislative_foundation: arrFiles[14] || '',
    archive_launch_enterprise: arrFiles[15] || '',
  }

  try {
    const newConstructor = await db('сonstructors').insert(constructorToDB).returning('*')
    console.log(newConstructor)

    return res.status(200).json({ message: 'OK' })
  } catch (error) {
    console.log('Error in constructor.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}
