import { Router } from 'express'

import { createTenant, getTenant, updateTenant } from '@/main/handlers/tenant'

const router = Router()

router.get('/:cognitoId', getTenant)

router.post('/', createTenant)

router.put('/:cognitoId', updateTenant)

export default router
