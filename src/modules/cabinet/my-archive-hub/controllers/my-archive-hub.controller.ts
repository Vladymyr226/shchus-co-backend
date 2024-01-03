import { Response } from 'express'
import db from '../../../../db/knexKonfig'
import { uploadFileToS3 } from '../../../../helper/helper'

export async function createMyArchiveHub(req, res: Response) {
  const { lorem0, lorem1, lorem2 } = req.query

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
      console.log('Error in my-archive-hub.controller.ts: ', error)
    }
  }
  const archiveHubToDB = {
    lorem_0: lorem0 as string,
    lorem_1: lorem1 as string,
    lorem_2: lorem2 as string,

    img_file0: arrFiles[0] || '',
    archive_file0: arrFiles[1] || '',
  }

  try {
    const newItem = await db('archive_hub').insert(archiveHubToDB).returning('*')
    console.log(newItem)

    return res.status(201).json({ message: 'OK' })
  } catch (error) {
    console.error('Error in my-archive-hub.controller.ts', error)
    return res.status(400).json({ message: error })
  }
}
