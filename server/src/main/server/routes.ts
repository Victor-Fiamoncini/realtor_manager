import { Request, Response, Router } from 'express'

const router = Router()

router.get('/health', (_: Request, response: Response) => {
  return response.status(200).send('Server is healthy 🏠')
})

export default router
