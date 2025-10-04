import { Router } from 'express'

import { createManager, getManager } from '../handlers/manager'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use('/managers', authMiddleware(['manager']))

router.get('/:cognitoId', getManager)

router.post('/', createManager)

export default router
