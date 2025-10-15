import { Router } from 'express'

import { createApplication, getApplications, updateApplicationStatus } from '@/main/handlers/application'
import authMiddleware from '@/main/middleware/auth'

const router = Router()

router.get('/', authMiddleware(['manager', 'tenant']), getApplications)

router.post('/', authMiddleware(['tenant']), createApplication)

router.put('/:id/status', authMiddleware(['manager']), updateApplicationStatus)

export default router
