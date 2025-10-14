import { Router } from 'express'

import { getLeasePayments, getLeases } from '@/main/handlers/lease'

const router = Router()

router.get('/', getLeases)

router.get('/:id/payments', getLeasePayments)

export default router
