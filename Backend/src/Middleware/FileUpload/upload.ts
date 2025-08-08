import multer, { StorageEngine } from 'multer'
import { NextFunction, Request, Response } from 'express'
import path from 'path'

const storage: StorageEngine = multer.diskStorage({
  destination: 'images/users/',
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-'
    cb(null, uniqueSuffix + file.originalname)
  }
})

// Create the uploader with TypeScript
const uploader = multer({
  storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    const supportedImage = /png|jpg|jpeg/
    const extension = path.extname(file.originalname).toLowerCase()

    if (supportedImage.test(extension)) {
      cb(null, true)
    } else {
      cb(new Error('Must be a png/jpg/jpeg image'))
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  }
})

export default uploader
