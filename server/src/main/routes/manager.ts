import { Request, Response, Router } from 'express'

import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use('/managers', authMiddleware(['manager']))

router.get('/', (_: Request, response: Response) => {
  return response.status(200).send('Managers')
})

export default router
