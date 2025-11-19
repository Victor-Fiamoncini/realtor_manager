import { Router } from 'express'

import { getLeases } from '@/main/handlers/lease'
import authMiddleware from '@/main/middleware/auth'

const router = Router()

router.get('/', authMiddleware(['manager', 'tenant']), getLeases)

export default router
