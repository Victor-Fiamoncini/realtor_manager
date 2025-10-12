import { Router } from 'express'

import { createManager, getManager, getManagerProperties, updateManager } from '@/main/handlers/manager'

const router = Router()

router.get('/:cognitoId', getManager)

router.post('/', createManager)

router.put('/:cognitoId', updateManager)

router.get('/:cognitoId/properties', getManagerProperties)

export default router
