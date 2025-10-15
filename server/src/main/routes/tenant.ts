import { Router } from 'express'

import {
  addFavoriteProperty,
  createTenant,
  getCurrentResidences,
  getTenant,
  removeFavoriteProperty,
  updateTenant,
} from '@/main/handlers/tenant'
import { authMiddleware } from '@/main/middleware/auth'

const router = Router()

router.get('/:cognitoId', authMiddleware(['tenant']), getTenant)

router.post('/', authMiddleware(['tenant']), createTenant)

router.put('/:cognitoId', authMiddleware(['tenant']), updateTenant)

router.get('/:cognitoId/current-residences', authMiddleware(['tenant']), getCurrentResidences)

router.post('/:cognitoId/favorites/:propertyId', authMiddleware(['tenant']), addFavoriteProperty)

router.delete('/:cognitoId/favorites/:propertyId', authMiddleware(['tenant']), removeFavoriteProperty)

export default router
