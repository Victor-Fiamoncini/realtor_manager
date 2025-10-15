import { Router } from 'express'

import { getLeasePayments, getLeases } from '@/main/handlers/lease'
import authMiddleware from '@/main/middleware/auth'

const router = Router()

router.get('/', authMiddleware(['manager', 'tenant']), getLeases)

router.get('/:id/payments', authMiddleware(['manager', 'tenant']), getLeasePayments)

export default router
