import { Router } from 'express'

import { createTenant, getTenant } from '../handlers/tenant'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use('/tenants', authMiddleware(['tenant']))

router.get('/:cognitoId', getTenant)

router.post('/', createTenant)

export default router
