import { Router } from 'express'

import { createManager, getManager } from '../handlers/manager'

const router = Router()

router.get('/:cognitoId', getManager)

router.post('/', createManager)

export default router
