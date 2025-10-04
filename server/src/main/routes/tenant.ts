import { Request, Response, Router } from 'express'

import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use('/tenants', authMiddleware(['tenant']))

router.get('/', (_: Request, response: Response) => {
  return response.status(200).send('Tenants')
})

export default router
