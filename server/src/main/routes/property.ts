import { Router } from 'express'
import multer from 'multer'

import { createProperty, getProperties, getProperty } from '@/main/handlers/property'
import { authMiddleware } from '@/main/middleware/auth'

const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = Router()

router.get('/', getProperties)

router.get('/:id', getProperty)

router.post('/', authMiddleware(['manager']), upload.array('photos'), createProperty)

export default router
