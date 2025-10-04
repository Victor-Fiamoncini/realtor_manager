import { Router } from 'express'

import { createTenant, getTenant } from '../handlers/tenant'

const router = Router()

router.get('/:cognitoId', getTenant)

router.post('/', createTenant)

export default router
