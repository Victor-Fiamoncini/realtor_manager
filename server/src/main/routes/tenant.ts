import { Router } from 'express'

import { createTenant, getCurrentResidences, getTenant, updateTenant } from '@/main/handlers/tenant'

const router = Router()

router.get('/:cognitoId', getTenant)

router.post('/', createTenant)

router.put('/:cognitoId', updateTenant)

router.get('/:cognitoId/current-residences', getCurrentResidences)

export default router
