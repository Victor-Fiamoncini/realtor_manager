import { Router } from 'express'

import { createManager, getManager, getManagerProperties, updateManager } from '@/main/handlers/manager'
import authMiddleware from '@/main/middleware/auth'

const router = Router()

router.get('/:cognitoId', authMiddleware(['manager']), getManager)

router.post('/', authMiddleware(['manager']), createManager)

router.put('/:cognitoId', authMiddleware(['manager']), updateManager)

router.get('/:cognitoId/properties', authMiddleware(['manager']), getManagerProperties)

export default router
