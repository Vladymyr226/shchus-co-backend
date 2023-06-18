import { Response } from 'express'
import multer, { FileFilterCallback } from 'multer'

const types = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'video/mp4',
  'application/pdf',
  'application/zip',
]

const fileFilter = (res: Response, file, cb: FileFilterCallback) => {
  if (types.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false)
  }
}

export { fileFilter }
