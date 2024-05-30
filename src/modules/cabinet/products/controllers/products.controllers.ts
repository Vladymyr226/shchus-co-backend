import { Response } from 'express'
import db from '../../../../db/knexKonfig'

interface ProductInfo {
  user_id: string
  title_section: string
  title_product: string
  country_manufacturer: string
  descr_product: string
  about_company: string
  core_product: string
  photo_product: string
  video_product: string
  pdf_product: string
  public_archive_product: string
  private_archive_product: string
}

export async function createProduct(req, res: Response) {
  const {
    currentUserId,
    insulation,
    titleSection,
    titleProduct,
    countryManufacturer,
    descrProduct,
    aboutCompany,
    coreProduct,
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
      // const location = await uploadFileToS3(uploadParams)
      // arrFiles.push(location)
    } catch (error) {
      console.log('Error in products.controller.ts: ', error)
    }
  }

  const productToDB: ProductInfo = {
    user_id: currentUserId as string,
    title_section: titleSection as string,
    title_product: titleProduct as string,
    country_manufacturer: countryManufacturer as string,
    descr_product: descrProduct as string,
    about_company: aboutCompany as string,
    core_product: coreProduct as string,
    photo_product: arrFiles[0] || '',
    video_product: arrFiles[1] || '',
    pdf_product: arrFiles[2] || '',
    public_archive_product: arrFiles[3] || '',
    private_archive_product: arrFiles[4] || '',
  }

  try {
    if (insulation === 'Лита') {
      switch (productToDB.title_section) {
        case 'Індуктивний трансформатор напруги':
          let newProduct = await db('cast_ind_transf_voltage').insert(productToDB).returning('*')
          console.log(newProduct)
          return res
            .status(201)
            .json({ message: 'The product has been created and added successfully!' })

        case 'Ємнісний трансформатор напруги':
        // newProduct = await db('').insert(productToDB).returning('*')
        // console.log(newProduct)
        // return res
        //   .status(201)
        //   .json({ message: 'The product has been created and added successfully!' })

        case 'Цифровий трансформатор напруги':
        // newProduct = await db('').insert(productToDB).returning('*')
        // console.log(newProduct)
        // return res
        //   .status(201)
        //   .json({ message: 'The product has been created and added successfully!' })

        default:
          return res.status(405).json({ product: 'default workaet' })
      }
    }
  } catch (error) {
    console.log('Error in products.controller', error)
    return res.status(400).json({ message: error })
  }
}
