import { Router } from 'express'

import { createManager, getManager, updateManager } from '../handlers/manager'

const router = Router()

router.get('/:cognitoId', getManager)

router.post('/', createManager)

router.put('/:cognitoId', updateManager)

export default router
