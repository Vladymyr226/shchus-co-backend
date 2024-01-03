import { Response } from 'express'
import db from '../../../../db/knexKonfig'
import { uploadFileToS3 } from '../../../../helper/helper'

export async function createMyConstructorStartup(req, res: Response) {
  const { lorem0, lorem1, lorem2, lorem3, lorem4, selectedOption, lorem5, lorem6, lorem7, lorem8 } =
    req.query

  console.log(
    lorem0,
    lorem1,
    lorem2,
    lorem3,
    lorem4,
    selectedOption,
    lorem5,
    lorem6,
    lorem7,
    lorem8
  )

  const arrDifferentTypesFiles = Object.keys(req.files)
  let arrFiles: any[] = []

  for (let index = 0; index < arrDifferentTypesFiles.length; index++) {
    selectedOption
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
      console.log('Error in my-constructor-startup.controller: ', error)
    }
  }
  const myConstructorDesignerToDB = {
    lorem_0: lorem0 as string,
    lorem_1: lorem1 as string,
    lorem_2: lorem2 as string,
    lorem_3: lorem3 as string,
    lorem_4: lorem4 as string,
    selected_option: selectedOption as string,
    lorem_5: lorem5 as string,
    lorem_6: lorem6 as string,
    lorem_7: lorem7 as string,
    lorem_8: lorem8 as string,

    video_file0: arrFiles[0] || '',
    img_file0: arrFiles[1] || '',
    img_file2: arrFiles[2] || '',
    video_file1: arrFiles[3] || '',
    archive_file0: arrFiles[4] || '',
  }

  try {
    const newItem = await db('constructor_startups')
      .insert(myConstructorDesignerToDB)
      .returning('*')
    console.log(newItem)

    return res.status(201).json({ message: 'OK' })
  } catch (error) {
    console.error('Error in my-constructor-designer.controller', error)
    return res.status(400).json({ message: error })
  }
}
